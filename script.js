(function() {
  const cards = [
    {name: 'Ace', value: 1}, {name: '2', value: 2}, {name: '3', value: 3},
    {name: '4', value: 4}, {name: '5', value: 5}, {name: '6', value: 6},
    {name: '7', value: 7}, {name: '8', value: 8}, {name: '9', value: 9},
    {name: '10', value: 10}, {name: 'Jack', value: 11},
    {name: 'Queen', value: 12}, {name: 'King', value: 13}
  ];
  const suits = ['Spades', 'Hearts', 'Diamonds', 'Clubs'];
  const hands = {
    HIGH_CARD: 0,
    PAIR: 1,
    TWO_PAIR: 2,
    STRAIGHT: 3,
    FLUSH: 4,
    TRIPS: 5,
    FULL_HOUSE: 6,
    FOUR: 7,
    STRAIGHT_FLUSH: 8,
    ROYAL_FLUSH: 9
  };

  const validateHand = hand => {
    const values = _.sortBy(_.map(hand, 'value'));
    const suits = _.map(hand, 'suit');
    const {isStraight, isFlush, isPair, isTrips, isRoyal} = Utils.hands;
    let handValue = hands.HIGH_CARD;

    if(isStraight(values)) {
      handValue = hands.STRAIGHT;
      if(isFlush(suits)) {
        handValue = hands.STRAIGHT_FLUSH;
        if(isRoyal(values)) {
          handValue = hands.ROYAL_FLUSH;
        }
      }
    } else if(isFlush(suits)) {
      handValue = hands.FLUSH;
    } else if(isPair(values)) {
      handValue = hands.PAIR;
    } else if(isTrips(values)) {
      handValue = hands.TRIPS;
    }

    return handValue;
  };

  class Card {
    constructor(card, suit) {
      this.card = card;
      this.suit = suit;
    }

    get item() {
      const { suit, card } = this;
      const {name, value} = card;
      return {
        name: name,
        value: value,
        suit: suit,
        displayName: `${name} of ${suit}`
      };
    }
  }

  class Deck {
    constructor(handSize, players) {
      this.deck = null;
      this.currentDeal = null;
      this.handSize = handSize;
      this.players = players;
    };

    reset(){
      this.deck = [];
      for(let c in cards) {
        for(let s in suits) {
          this.deck.push(new Card(cards[c], suits[s]).item);
        }
      }
    }

    shuffle() {
      const {deck} = this;
      let m = deck.length, i;
      while (m) {
        i = Math.floor(Math.random() * m--);

        [deck[m], deck[i]] = [deck[i], deck[m]];
      }
      return this;
    }

    dealCards() {
      const arr = [];
      let {deck, handSize} = this;
      do {
        arr.push(deck.pop());
        handSize--;
      }
      while (handSize > 0 );
      return arr;
    }

    deal() {
      //deal to player
      const playerCards = this.dealCards();

      //deal to dealer
      const dealerCards = this.dealCards();

      this.currentDeal = {
        playerCards: playerCards,
        dealerCards: dealerCards
      };

      return this.currentDeal;
    }
  }

  const d = new Deck(3, 1);

  $('#deal').click(() => {
    $('.result').html('');
    d.reset();
    d.shuffle();
    const deal = d.deal();
    const {playerCards, dealerCards} = deal;
    let playerStr = '', dealerStr = '';

    for(let p in playerCards) {
      playerStr += `<div>${playerCards[p].displayName}</div>`;
    }

    for(let dc in dealerCards) {
      dealerStr += `<div>${dealerCards[dc].displayName}</div>`;
    }

    $('#player').html(playerStr);
    $('#dealer').html(dealerStr);
  })

  $('#result').click(() => {
    const {playerCards, dealerCards} = d.currentDeal;
    const playerHand = validateHand(playerCards);
    const dealerHand = validateHand(dealerCards);

    console.log(`player:${playerHand} dealer:${dealerHand}`);

    if(playerHand > dealerHand) {
      $('.result').addClass('win').html(`Player wins! ${(_.invert(hands))[playerHand]}`);
    } else if(dealerHand > playerHand) {
      $('.result').removeClass('win').html(`Dealer wins! ${(_.invert(hands))[dealerHand]}`);
    } else if(playerHand === dealerHand) {
      if(playerHand === 0) {
        Utils.hands.resolveHighCard(playerCards, dealerCards);
      } else {
        Utils.hands.resolveHand(playerCards, dealerCards, playerHand);
      }
    }
  });
})();
