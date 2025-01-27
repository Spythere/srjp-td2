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
