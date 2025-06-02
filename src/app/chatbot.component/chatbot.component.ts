import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

type Perfume = {
  name: string;
  price: number;
  description: string;
  image: string;
};

type ChatMessage = {
  text: string;
  isUser: boolean;
  product?: Perfume;
};

type PerfumeCategory = 'floral' | 'men' | 'women' | 'woody' | 'fruity' | 'budget';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ChatbotComponent {
  chatOpen = false;
  messages: ChatMessage[] = [];
  userInput = '';
  
  // Quick suggestions with consistent formatting
  quickSuggestions = [
    "Prix de Chanel No 5",
    "Parfums floraux recommandés",
    "Meilleurs parfums pour homme",
    "Options sous 50€"
  ];

  private perfumeDatabase: Record<string, Perfume> = {
    'chanel_no5': {
      name: "Chanel No 5",
      price: 120,
      description: "Floral-aldéhydé avec notes d'ylang-ylang et vanille",
      image: "https://images.unsplash.com/photo-1601049676869-702ea24cfd58?q=80&w=2073&auto=format&fit=crop"
    },
    'dior_sauvage': {
      name: "Dior Sauvage",
      price: 115,
      description: "Frais et épicé avec notes de bergamote et poivre",
      image: "assets/dior-sauvage.jpg"
    },
    'miss_dior': {
      name: "Miss Dior",
      price: 95,
      description: "Floral moderne avec notes de pivoine",
      image: "assets/miss-dior.jpg"
    },
    'bleu_de_chanel': {
      name: "Bleu de Chanel",
      price: 105,
      description: "Boisé aromatique pour homme",
      image: "assets/bleu-de-chanel.jpg"
    },
    'zara_vibrant': {
      name: "Zara Vibrant Leather",
      price: 29.99,
      description: "Alternative abordable aux parfums de luxe",
      image: "assets/zara-vibrant.jpg"
    }
  };

  private categoryRecommendations: Record<PerfumeCategory, {text: string, products: string[]}> = {
    'floral': {
      text: "Nos parfums floraux recommandés:",
      products: ['chanel_no5', 'miss_dior']
    },
    'men': {
      text: "Parfums masculins populaires:",
      products: ['dior_sauvage', 'bleu_de_chanel']
    },
    'women': {
      text: "Parfums féminins tendance:",
      products: ['chanel_no5', 'miss_dior']
    },
    'woody': {
      text: "Parfums boisés:",
      products: ['bleu_de_chanel']
    },
    'fruity': {
      text: "Parfums fruités:",
      products: []
    },
    'budget': {
      text: "Options abordables:",
      products: ['zara_vibrant']
    }
  };

  toggleChat() {
    this.chatOpen = !this.chatOpen;
    if (this.chatOpen && this.messages.length === 0) {
      this.messages.push({
        text: "Bonjour! Je suis votre conseiller en parfums. Posez-moi vos questions sur nos produits.",
        isUser: false
      });
    }
  }

  sendMessage() {
    if (this.userInput.trim()) {
      const cleanInput = this.userInput.trim();
      this.messages.push({text: cleanInput, isUser: true});
      
      setTimeout(() => {
        const response = this.generateBotResponse(cleanInput);
        this.messages.push(response);
      }, 500);
      
      this.userInput = '';
    }
  }

  sendSuggestion(suggestion: string) {
    this.userInput = suggestion.trim();
    this.sendMessage();
  }

  private generateBotResponse(userInput: string): ChatMessage {
    const input = userInput.toLowerCase().trim();
    
    // Try quick suggestions first
    const quickResponse = this.handleQuickSuggestions(input);
    if (quickResponse) return quickResponse;

    // Then check for specific queries
    const exactMatch = this.findExactPerfumeMatch(input);
    if (exactMatch) return exactMatch;

    const partialMatch = this.findPartialPerfumeMatch(input);
    if (partialMatch) return partialMatch;

    if (this.isPriceQuery(input)) {
      return this.handlePriceQuery(input);
    }

    const categoryResponse = this.handleCategoryQueries(input);
    if (categoryResponse) return categoryResponse;

    return {
      text: this.getContextualHelp(input),
      isUser: false
    };
  }

  private handleQuickSuggestions(input: string): ChatMessage | null {
    const normalizedInput = input.toLowerCase().trim();
    
    const suggestionMap = [
      { 
        match: 'prix de chanel no 5', 
        action: () => this.createPerfumeResponse('chanel_no5', this.perfumeDatabase['chanel_no5'])
      },
      { 
        match: 'parfums floraux recommandés', 
        action: () => this.getCategoryResponse('floral')
      },
      { 
        match: 'meilleurs parfums pour homme', 
        action: () => this.getCategoryResponse('men')
      },
      { 
        match: 'options sous 50€', 
        action: () => this.getCategoryResponse('budget')
      }
    ];

    const matched = suggestionMap.find(item => 
      normalizedInput === item.match.toLowerCase()
    );

    return matched ? matched.action() : null;
  }

  private findExactPerfumeMatch(input: string): ChatMessage | null {
    for (const [id, perfume] of Object.entries(this.perfumeDatabase)) {
      if (input === perfume.name.toLowerCase()) {
        return this.createPerfumeResponse(id, perfume);
      }
    }
    return null;
  }

  private findPartialPerfumeMatch(input: string): ChatMessage | null {
    for (const [id, perfume] of Object.entries(this.perfumeDatabase)) {
      const perfumeWords = perfume.name.toLowerCase().split(' ');
      const inputWords = input.split(' ');
      
      const hasMatch = inputWords.some(inputWord => 
        perfumeWords.some(perfumeWord => 
          perfumeWord.includes(inputWord) || inputWord.includes(perfumeWord)
        )
      );
      
      if (hasMatch) {
        return this.createPerfumeResponse(id, perfume);
      }
    }
    return null;
  }

  private createPerfumeResponse(id: string, perfume: Perfume): ChatMessage {
    return {
      text: `${perfume.name}: ${perfume.description}. Prix: ${perfume.price}€`,
      isUser: false,
      product: perfume
    };
  }

  private isPriceQuery(input: string): boolean {
    const priceKeywords = ['prix', 'price', 'coûte', 'combien', '€', 'euro'];
    return priceKeywords.some(keyword => input.includes(keyword));
  }

  private handlePriceQuery(input: string): ChatMessage {
    const perfumeMatch = this.findPartialPerfumeMatch(input);
    if (perfumeMatch) return perfumeMatch;

    return {
      text: "Nos parfums vont de 30€ à 200€. Pour quel parfum souhaitez-vous connaître le prix exact?",
      isUser: false
    };
  }

  private handleCategoryQueries(input: string): ChatMessage | null {
    const categories: {keywords: string[], category: PerfumeCategory}[] = [
      {keywords: ['floral', 'fleur', 'rose'], category: 'floral'},
      {keywords: ['boisé', 'bois', 'wood'], category: 'woody'},
      {keywords: ['fruité', 'fruit'], category: 'fruity'},
      {keywords: ['homme', 'masculin', 'men'], category: 'men'},
      {keywords: ['femme', 'féminin', 'women'], category: 'women'},
      {keywords: ['budget', 'abordable', 'pas cher', '50', '100'], category: 'budget'}
    ];

    for (const {keywords, category} of categories) {
      if (keywords.some(keyword => input.includes(keyword))) {
        return this.getCategoryResponse(category);
      }
    }
    return null;
  }

  private getCategoryResponse(category: PerfumeCategory): ChatMessage {
    const recommendation = this.categoryRecommendations[category];
    
    if (recommendation.products.length === 0) {
      return {
        text: `Nous n'avons pas de parfums ${category} actuellement. Essayez "floral" ou "boisé".`,
        isUser: false
      };
    }

    const products = recommendation.products.map(id => this.perfumeDatabase[id]);
    const productList = products.map(p => 
      `• ${p.name}: ${p.description} (${p.price}€)`
    ).join('\n\n');

    return {
      text: `${recommendation.text}\n\n${productList}`,
      isUser: false,
      product: products[0] // Show first product in UI card
    };
  }

  private getContextualHelp(input: string): string {
    if (input.length < 3) {
      return "Pour des meilleurs résultats, posez une question plus détaillée comme 'Prix de Chanel No 5'";
    }

    const helpOptions = [
      "Essayez de mentionner un parfum spécifique comme 'Dior Sauvage'",
      "Voulez-vous connaître le prix d'un parfum en particulier?",
      "Cherchez-vous un parfum floral, boisé ou fruité?",
      "Nos marques principales sont Chanel, Dior et Zara"
    ];

    return helpOptions[input.length % helpOptions.length];
  }
}