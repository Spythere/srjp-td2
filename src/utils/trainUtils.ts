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

export const unitNameCorrections: Record<string, string> = {
  '2EN57': 'EN57',
  '201E': 'ET22',
  '4E': 'EU07',
  M62: 'ST44',
  CTLR4C: 'ST44',
};