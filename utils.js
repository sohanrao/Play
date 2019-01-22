const isStraight = values => {
  const [first, sec, third] = values;
  if(sec === (first + 1) && third === (sec + 1)) {
    return true;
  }
  if(first === 1) { //ace
    if(sec === 12 && third === 13) {
      return true;
    }
  }
  return false;
}

const isFlush = suits => {
  return _.uniq(suits).length === 1;
}

const isPair = values => {
  return _.uniq(values).length === 2;
}

const isTrips = values => {
  return _.uniq(values).length === 1;
}

const isRoyal = values => {
  const {first, sec, third} = values;
  if(first === 1 && sec === 12 && third === 13) {
    return true;
  }
  return false;
}

const resolveHighCard = (p, d) => {
  const pValues = _.sortBy(_.map(p, 'value'));
  const dValues = _.sortBy(_.map(d, 'value'));
  let pWon = false;
  pValues[0] = pValues[0] === 1 ? 15 : pValues[0];
  dValues[0] = dValues[0] === 1 ? 15 : dValues[0];

  pWon = _.max(pValues) > _.max(dValues);
  return pWon;
}

const resolveHand = (player, dealer, result) => {

}

const Utils = {
  hands: {
    isStraight: isStraight,
    isFlush: isFlush,
    isPair: isPair,
    isTrips: isTrips,
    isRoyal: isRoyal
  },
  resolveHighCard: resolveHighCard,
  resolveHand: resolveHand
}
