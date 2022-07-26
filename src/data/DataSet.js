export const dataSet = [
  {
    user: "willy",
    name: "Willy",
    display: true,
    transportData: [
      {
        title: "上班",
        data: [
          [
            {
              seq: 11,
              co: "kmb",
              route: "13X",
              stopId: "AA97FFC49AE957A5",
            },
            {
              seq: 26,
              co: "kmb",
              route: "213X",
              stopId: "AA97FFC49AE957A5",
            },
            {
              seq: 15,
              co: "kmb",
              route: "224X",
              stopId: "AA97FFC49AE957A5",
            },
          ],
        ],
      },
      {
        title: "回家",
        data: [
          [
            {
              seq: 6,
              co: "kmb",
              route: "28",
              stopId: "F90ED764C7A95649",
            },
            {
              seq: 15,
              co: "kmb",
              route: "297",
              stopId: "F90ED764C7A95649",
            },
          ],
          [
            {
              seq: 11,
              co: "kmb",
              route: "297",
              stopId: "9762FC524B26C4A7",
            },
            {
              seq: 18,
              co: "nwfb",
              route: "796X",
              stopId: "003589",
            },
          ],
          [
            {
              seq: 7,
              co: "kmb",
              route: "26",
              stopId: "5D77A5CBE41F2984",
            },
          ],
        ],
      },
      {
        title: "藍田",
        data: [
          [
            {
              seq: 11,
              co: "kmb",
              route: "98D",
              stopId: "BE27F066CF40DF7D",
            },
            {
              seq: 13,
              co: "kmb",
              route: "296D",
              stopId: "BE27F066CF40DF7D",
            },
            {
              seq: 11,
              co: "nwfb",
              route: "796P",
              stopId: "003365",
            },
          ],
          [
            {
              seq: 10,
              co: "kmb",
              route: "98D",
              stopId: "33033960343A57A8",
            },
            {
              seq: 12,
              co: "kmb",
              route: "296D",
              stopId: "33033960343A57A8",
            },
            {
              seq: 10,
              co: "nwfb",
              route: "796P",
              stopId: "001412",
            },
          ],
        ],
      },
      {
        title: "西貢",
        data: [
          [
            {
              seq: 13,
              co: "kmb",
              route: "111",
              stopId: "F6A446C66F7F805E",
            },
            {
              seq: 15,
              co: "kmb",
              route: "116",
              stopId: "F6A446C66F7F805E",
            },
            {
              seq: 8,
              co: "kmb",
              route: "5",
              stopId: "E37FF663075361FE",
            },
          ],
          [
            {
              seq: 1,
              co: "kmb",
              route: "96R",
              stopId: "D7132C4D6287B688",
            },
          ],
        ],
      },
      {
        data: [
          [
            {
              co: "mtr",
              url: [
                "https://rt.data.gov.hk/v1/transport/mtr/getSchedule.php?line=TML&sta=TKW",
              ],
              direction: ["up", "down"],
            },
            {
              co: "mtr",
              url: [
                "https://rt.data.gov.hk/v1/transport/mtr/getSchedule.php?line=TML&sta=SIH",
              ],
              direction: ["up", "down"],
            },
          ],
        ],
      },
    ],
  },
  {
    user: "shan",
    name: "Shan",
    display: true,
    transportData: [
      {
        title: "上班",
        data: [
          [
            {
              co: "mtr",
              url: [
                "https://rt.data.gov.hk/v1/transport/mtr/getSchedule.php?line=TML&sta=TKW",
              ],
              direction: ["up"],
            },
          ],
          [
            {
              seq: 13,
              co: "kmb",
              route: "5",
              stopId: "7CC8FC8889FF1596",
            },
            {
              seq: 9,
              co: "kmb",
              route: "5A",
              stopId: "7CC8FC8889FF1596",
            },
            {
              seq: 13,
              co: "kmb",
              route: "5P",
              stopId: "7CC8FC8889FF1596",
            },
            {
              seq: 15,
              co: "kmb",
              route: "26",
              stopId: "7CC8FC8889FF1596",
            },
            {
              seq: 10,
              co: "kmb",
              route: "28",
              stopId: "AB51CD6EFEF7E09E",
            },
          ],
        ],
      },
      {
        title: "回家",
        data: [
          [
            {
              seq: 1,
              co: "kmb",
              route: "5",
              stopId: "96363F113F394E8A",
            },
            {
              seq: 1,
              co: "kmb",
              route: "5A",
              stopId: "D7E4D53EF0B874EB",
            },
            {
              seq: 1,
              co: "kmb",
              route: "5P",
              stopId: "4D5FBE4639E869E3",
            },
            {
              seq: 1,
              co: "kmb",
              route: "14",
              stopId: "9D843189602DE04F",
            },
            {
              seq: 5,
              co: "kmb",
              route: "26",
              stopId: "DAE7B6CB56131B50",
            },
            {
              seq: 1,
              co: "kmb",
              route: "28",
              stopId: "96363F113F394E8A",
            },
            {
              seq: 4,
              co: "kmb",
              route: "215X",
              stopId: "B7A8F179CD71B22E",
            },
          ],
        ],
      },
    ],
  },
  {
    user: "test",
    name: "Test",
    display: false,
    transportData: [
      {
        title: "上班",
        data: [
          [
            {
              seq: 1,
              co: "kmb",
              route: "96R",
              stopId: "D7132C4D6287B688",
            },
          ],
        ],
      },
    ],
  },
  {
    user: "test1",
    name: "Test1",
    display: false,
    transportData: [
      {
        data: [
          [
            {
              seq: 1,
              co: "kmb",
              route: "N216",
              stopId: "0D8135B0D81F29A1",
            },
            {
              seq: 1,
              co: "nwfb",
              route: "N796",
              stopId: "003329",
            },
            {
              seq: 11,
              co: "kmb",
              route: "S1",
              stopId: "89A83934270E9BFB",
            },
          ],
        ],
      },
    ],
  },
];
