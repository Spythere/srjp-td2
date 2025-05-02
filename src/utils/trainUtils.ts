const unitNameCorrections: Record<string, string[]> = {
  '2EN57': ['EN57', 'EN57'],
  '201E': ['ET22'],
  '4E': ['EU07'],
  M62: ['ST44'],
  CTLR4C: ['ST44']
};

export const getRegionNameById = (id: string) => {
  switch (id) {
    case 'eu':
      return 'PL1';

    case 'cae':
      return 'PL2';

    case 'us':
      return 'CZE';

    case 'usw':
      return 'DE';

    case 'ru':
      return 'ENG';

    default:
      return 'PL1';
  }
};

export function getHeadUnits(stockString: string) {
  const stockList = stockString.split(';').slice(0, 3);

  return stockList.reduce((acc, unitType, i) => {
    if (i != 0 && !/-\d+$/.test(unitType)) return acc;

    const unitName = unitType.slice(0, unitType.indexOf('-'));

    const correctedNames = unitNameCorrections[unitName] ?? [unitName];

    acc.push(...correctedNames);

    return acc;
  }, [] as string[]);
}
