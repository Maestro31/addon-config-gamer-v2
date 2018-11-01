import FormFilter from '../src/components/SearchComponent/FormFilter';

export default {
  component: FormFilter,
  props: {
    filters: [
      {
        id: '3',
        type: 'combo',
        label: 'Marque',
        options: [
          {
            label: 'AMD',
            value: '63'
          },
          {
            label: 'INTEL',
            value: '61'
          }
        ]
      },
      {
        id: '557',
        type: 'combo',
        label: 'Famille',
        options: [
          {
            label: 'AMD A10',
            value: '6486'
          },
          {
            label: 'AMD A12',
            value: '8906'
          },
          {
            label: 'AMD A6',
            value: '6484'
          },
          {
            label: 'AMD A8',
            value: '6485'
          },
          {
            label: 'AMD Athlon',
            value: '6487'
          },
          {
            label: 'AMD Athlon X4',
            value: '6490'
          },
          {
            label: 'AMD FX',
            value: '6491'
          },
          {
            label: 'AMD Ryzen 3',
            value: '8865'
          },
          {
            label: 'AMD Ryzen 5',
            value: '8660'
          },
          {
            label: 'AMD Ryzen 7',
            value: '8617'
          },
          {
            label: 'AMD Ryzen Threadripper',
            value: '8902'
          },
          {
            label: 'Intel Celeron',
            value: '6493'
          },
          {
            label: 'Intel Core i3',
            value: '6494'
          },
          {
            label: 'Intel Core i5',
            value: '6495'
          },
          {
            label: 'Intel Core i7',
            value: '6496'
          },
          {
            label: 'Intel Core i9',
            value: '8827'
          },
          {
            label: 'Intel Pentium',
            value: '6497'
          }
        ]
      },
      {
        id: '245',
        type: 'combo',
        label: 'Socket',
        options: [
          {
            label: 'AMD AM3+',
            value: '1921'
          },
          {
            label: 'AMD AM4',
            value: '8540'
          },
          {
            label: 'AMD TR4',
            value: '8901'
          },
          {
            label: 'Intel 1151',
            value: '5651'
          },
          {
            label: 'Intel 2011-V3',
            value: '5577'
          }
        ]
      },
      {
        id: '28',
        type: 'ruler',
        label: 'Nombre de coeurs',
        options: [
          {
            label: '2',
            value: 321
          },
          {
            label: '4',
            value: 2264
          },
          {
            label: '6',
            value: 2266
          },
          {
            label: '8',
            value: 2265
          },
          {
            label: '12',
            value: 8905
          },
          {
            label: '16',
            value: 8904
          },
          {
            label: '32',
            value: 9995
          }
        ]
      },
      {
        id: '54',
        type: 'ruler',
        label: 'Fréquence',
        options: [
          {
            label: '2.8 GHz',
            value: 1660
          },
          {
            label: '3 GHz',
            value: 2263
          },
          {
            label: '3.1 GHz',
            value: 1654
          },
          {
            label: '3.2 GHz',
            value: 1652
          },
          {
            label: '3.4 GHz',
            value: 1651
          },
          {
            label: '3.5 GHz',
            value: 1650
          },
          {
            label: '3.6 GHz',
            value: 1665
          },
          {
            label: '3.7 GHz',
            value: 1659
          },
          {
            label: '3.8 GHz',
            value: 1667
          },
          {
            label: '3.9 GHz',
            value: 1658
          },
          {
            label: '4 GHz',
            value: 2267
          },
          {
            label: '4.2 GHz',
            value: 1649
          },
          {
            label: '4.4 GHz',
            value: 3020
          }
        ]
      },
      {
        id: '604',
        type: 'combo',
        label: 'Coefficient débloqué',
        options: [
          {
            label: 'Non',
            value: '6847'
          },
          {
            label: 'Oui',
            value: '6846'
          }
        ]
      },
      {
        id: 'p',
        type: 'ruler',
        label: 'Prix',
        options: [
          {
            label: '44.90 €',
            value: 4490
          },
          {
            label: '70.00 €',
            value: 7000
          },
          {
            label: '95.00 €',
            value: 9500
          },
          {
            label: '121.00 €',
            value: 12100
          },
          {
            label: '146.00 €',
            value: 14600
          },
          {
            label: '171.00 €',
            value: 17100
          },
          {
            label: '196.00 €',
            value: 19600
          },
          {
            label: '222.00 €',
            value: 22200
          },
          {
            label: '247.00 €',
            value: 24700
          },
          {
            label: '272.00 €',
            value: 27200
          },
          {
            label: '297.00 €',
            value: 29700
          },
          {
            label: '466.00 €',
            value: 46600
          },
          {
            label: '635.00 €',
            value: 63500
          },
          {
            label: '804.00 €',
            value: 80400
          },
          {
            label: '972.00 €',
            value: 97200
          },
          {
            label: '1141.00 €',
            value: 114100
          },
          {
            label: '1310.00 €',
            value: 131000
          },
          {
            label: '1479.00 €',
            value: 147900
          },
          {
            label: '1647.00 €',
            value: 164700
          },
          {
            label: '1816.00 €',
            value: 181600
          },
          {
            label: '1984.90 €',
            value: 198490
          }
        ]
      }
    ]
  }
};
