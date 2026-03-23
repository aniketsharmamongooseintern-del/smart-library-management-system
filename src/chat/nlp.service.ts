import { Injectable, OnModuleInit } from '@nestjs/common';
import { NlpManager } from 'node-nlp';

@Injectable()
export class NlpService implements OnModuleInit {
  private manager: any;

  constructor() {
    this.manager = new NlpManager({ languages: ['en'] });
  }

  async onModuleInit() {
    // AVAILABILIT
    this.manager.addDocument('en', 'book hai kya', 'availability');
    this.manager.addDocument('en', 'kya ye book available hai', 'availability');
    this.manager.addDocument('en', 'do you have this book', 'availability');
    this.manager.addDocument('en', 'is this book available', 'availability');
    this.manager.addDocument('en', 'mujhe ye book chahiye', 'availability');
    this.manager.addDocument('en', 'ye book mil sakti hai kya', 'availability');
    this.manager.addDocument('en', 'available hai kya', 'availability');
    this.manager.addDocument('en', 'can i get this book', 'availability');
    this.manager.addDocument('en', 'is book present', 'availability');

    // RENT
    this.manager.addDocument('en', 'book rent karni hai', 'rent');
    this.manager.addDocument('en', 'mujhe book leni hai', 'rent');
    this.manager.addDocument('en', 'rent this book', 'rent');
    this.manager.addDocument('en', 'i want to rent a book', 'rent');
    this.manager.addDocument('en', 'lend me this book', 'rent');
    this.manager.addDocument('en', 'can i take this book', 'rent');
    this.manager.addDocument('en', 'book issue karni hai', 'rent');
    this.manager.addDocument('en', 'mujhe ye book de do', 'rent');
    this.manager.addDocument('en', 'book chahiye rent pe', 'rent');
    this.manager.addDocument('en', 'harry potter book rent karni hai', 'rent');

    //RETURN
    this.manager.addDocument('en', 'book return karni hai', 'return');
    this.manager.addDocument('en', 'mujhe book wapas karni hai', 'return');
    this.manager.addDocument('en', 'return this book', 'return');
    this.manager.addDocument('en', 'i want to return the book', 'return');
    this.manager.addDocument('en', 'book jama karni hai', 'return');
    this.manager.addDocument('en', 'give back this book', 'return');
    this.manager.addDocument('en', 'return my book', 'return');
    this.manager.addDocument('en', 'harry potter return karni hai', 'return');

    // WHO RENTED
    this.manager.addDocument('en', 'kisne ye book li hai', 'who_rented');
    this.manager.addDocument('en', 'who has this book', 'who_rented');
    this.manager.addDocument('en', 'ye book kisne li', 'who_rented');
    this.manager.addDocument('en', 'who rented this', 'who_rented');

    // DUE DATE
    this.manager.addDocument('en', 'kab return hogi', 'due_date');
    this.manager.addDocument('en', 'due date kya hai', 'due_date');
    this.manager.addDocument('en', 'when will it be returned', 'due_date');

    // RESERVE
    this.manager.addDocument('en', 'reserve kar do', 'reserve');
    this.manager.addDocument('en', 'waitlist me daal do', 'reserve');
    this.manager.addDocument('en', 'add me to waiting list', 'reserve');
    this.manager.addDocument('en', 'hold this book for me', 'reserve');
    this.manager.addDocument('en', 'jab aaye mujhe dena', 'reserve');
    //RETURN ALL
    this.manager.addDocument(
      'en',
      'meri saari books return kar do',
      'return_all'
    );
    this.manager.addDocument('en', 'return all books', 'return_all');
    this.manager.addDocument('en', 'return all my books', 'return_all');
    this.manager.addDocument('en', 'sab books wapas karni hai', 'return_all');
    this.manager.addDocument('en', 'return everything', 'return_all');
    this.manager.addDocument(
      'en',
      'mujhe sab books return karni hai',
      'return_all'
    );
    this.manager.addDocument('en', 'give back all books', 'return_all');
    await this.manager.train();
    this.manager.save();
  }

  async detectIntent(message: string) {
    const res = await this.manager.process('en', message);

    console.log('INTENT:', res.intent);
    console.log('SCORE:', res.score);

    return res.intent;
  }
}
