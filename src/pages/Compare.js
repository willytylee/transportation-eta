import { Section } from "../components/Bookmark/Section";

export const Compare = () => {
  const data = [
    {
      co: "mtr",
      route: "TML",
      stopId: "TKW",
      bound: ["up", "down"],
    },
    // {
    //   seq: 11,
    //   co: "kmb",
    //   route: "13X",
    //   stopId: "AA97FFC49AE957A5",
    // },
    // {
    //   seq: 26,
    //   co: "kmb",
    //   route: "213X",
    //   stopId: "AA97FFC49AE957A5",
    // },
    // {
    //   seq: 15,
    //   co: "kmb",
    //   route: "224X",
    //   stopId: "AA97FFC49AE957A5",
    // },
  ];
  const category = {
    title: "快速路線比較",
    data: [data],
  };
  return <Section category={category} />;
};
