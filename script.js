(function() {

  const cards = [
    {name: 'Ace', value: 1, un: '1'}, {name: '2', value: 2, un: '2'}, {name: '3', value: 3, un: '3'},
    {name: '4', value: 4, un: '4'}, {name: '5', value: 5, un: '5'}, {name: '6', value: 6, un: '6'},
    {name: '7', value: 7, un: '7'}, {name: '8', value: 8, un: '8'}, {name: '9', value: 9, un: '9'},
    {name: '10', value: 10, un: 'A'}, {name: 'Jack', value: 11, un: 'B'},
    {name: 'Queen', value: 12, un: 'D'}, {name: 'King', value: 13, un: 'E'}
  ];
  const suits = ['Spades', 'Hearts', 'Diamonds', 'Clubs'];
  const suitCodes = {
    SPADES: 'A',
    HEARTS: 'B',
    DIAMONDS: 'C',
    CLUBS: 'D'
  }
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
      const {name, value, un} = card;
      return {
        name: name,
        value: value,
        suit: suit,
        displayName: `${name} of ${suit}`,
        unicode: `&#x1F0${suitCodes[suit.toUpperCase()]}${un}`
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
  const $btnDeal = $('.btn-deal');
  const $btnPlay = $('.player2 .play');
  const $dealerCards = $(".dealer-area > .cards");
  const $dealerCardsMask = $(".dealer-area > .cards-mask");
  const $playerCards = $('.player2 > .card-holder');
  const $resultDiv = $(".result");

  $('.result').html('').hide();

  $btnDeal.click(() => {
    $resultDiv.html('').hide();
    $dealerCards.hide();
    $dealerCardsMask.show();
    d.reset();
    d.shuffle();
    const deal = d.deal();
    const {playerCards, dealerCards} = deal;
    let playerStr = '', dealerStr = '', dealerMaskStr = '';

    for(let p in playerCards) {
      const {suit, unicode} = playerCards[p];
      playerStr += `<div class="card ${suit.toLowerCase()}"><div class="card-inner">${unicode}</div></div>`;
    }

    dealerMaskStr += `<div class="card ${dealerCards[0].suit.toLowerCase()}"><div class="card-inner">${dealerCards[0].unicode}</div></div>`;
    dealerMaskStr += `<div class="card spades"><div class="card-inner">&#x1F0A0</div></div>`;
    dealerMaskStr += `<div class="card spades"><div class="card-inner">&#x1F0A0</div></div>`;

    for(let dc in dealerCards) {
      const {suit, unicode} = dealerCards[dc];
      dealerStr += `<div class="card ${suit.toLowerCase()}"><div class="card-inner">${unicode}</div></div>`;
    }

    $playerCards.html(playerStr);
    $dealerCardsMask.html(dealerMaskStr);
    $dealerCards.html(dealerStr);
  })

  $btnPlay.click(() => {
    console.log("sdsdfsdf");
    const {playerCards, dealerCards} = d.currentDeal;
    const playerHand = validateHand(playerCards);
    const dealerHand = validateHand(dealerCards);
    let winner = 'player';

    $dealerCards.show();
    $dealerCardsMask.hide();

    winner = playerHand > dealerHand ? 'player' : 'dealer';

    if(playerHand === dealerHand) {
      if(playerHand === 0) {
        winner = Utils.resolveHighCard(playerCards, dealerCards) ? 'player' : 'dealer';
      } else {
        winner = Utils.resolveHand(playerCards, dealerCards, playerHand)  ? 'player' : 'dealer';
      }
    }

    //render result
    const result = winner === 'player' ? 'You Win!' : 'You lose!';
    $resultDiv.show().html(result);
    //$resultDiv.append(`${(_.invert(hands))[playerHand]} vs ${(_.invert(hands))[dealerHand]}`).show();
  });
})();
