import { describe, expect, test } from "vitest";
import * as venn from "../src/index";

test("greedyLayout", () => {
  var areas = [
    { sets: [0], size: 0.7746543297103429 },
    { sets: [1], size: 0.1311252856844238 },
    { sets: [2], size: 0.2659942131443344 },
    { sets: [3], size: 0.44600866168641723 },
    { sets: [0, 1], size: 0.02051532092950205 },
    { sets: [0, 2], size: 0 },
    { sets: [0, 3], size: 0 },
    { sets: [1, 2], size: 0 },
    { sets: [1, 3], size: 0.07597023820511245 },
    { sets: [2, 3], size: 0 },
  ];

  var circles = venn.greedyLayout(areas),
    loss = venn.lossFunction(circles, areas);
  expect(loss).toBeCloseTo(0);

  areas = [
    { sets: [0], size: 0.5299368855059736 },
    { sets: [1], size: 0.03364187025606481 },
    { sets: [2], size: 0.3121450394871512 },
    { sets: [3], size: 0.0514397361783036 },
    { sets: [0, 1], size: 0.013912447645582351 },
    { sets: [0, 2], size: 0.005903647141469598 },
    { sets: [0, 3], size: 0.0514397361783036 },
    { sets: [1, 2], size: 0.012138157839477597 },
    { sets: [1, 3], size: 0.008010688232481479 },
    { sets: [2, 3], size: 0 },
  ];

  circles = venn.greedyLayout(areas);
  loss = venn.lossFunction(circles, areas);
  expect(loss).toBeCloseTo(0);

  // one small circle completely overlapped in the intersection
  // area of two larger circles
  areas = [
    { sets: [0], size: 1.7288584050841396 },
    { sets: [1], size: 0.040875831658950056 },
    { sets: [2], size: 2.587146019782323 },
    { sets: [0, 1], size: 0.040875831658950056 },
    { sets: [0, 2], size: 0.5114617575187569 },
    { sets: [1, 2], size: 0.040875831658950056 },
  ];

  circles = venn.greedyLayout(areas);
  loss = venn.lossFunction(circles, areas);
  expect(loss).toBeCloseTo(0);
});

describe("circleArea", () => {
  test("empty circle", () => {
    expect(venn.circleArea(10, 0)).toEqual(0);
  });

  test("half circle venn", () => {
    expect(venn.circleArea(10, 10)).toBeCloseTo((Math.PI * 10 * 10) / 2);
  });

  test("full circle venn", () => {
    expect(venn.circleArea(10, 20)).toBeCloseTo(Math.PI * 10 * 10);
  });
});

describe("circleOverlap", () => {
  test("nonoverlapping circles", () => {
    expect(venn.circleOverlap(10, 10, 200)).toEqual(0);
  });

  test("full overlapping circles", () => {
    expect(venn.circleOverlap(10, 10, 0)).toBeCloseTo(Math.PI * 10 * 10);
  });

  test("Some overalp in circles", () => {
    expect(venn.circleOverlap(10, 5, 5)).toBeCloseTo(Math.PI * 5 * 5);
  });
});

describe("distanceFromIntersectArea", () => {
  function testDistanceFromIntersectArea(
    r1: number,
    r2: number,
    overlap: number,
  ) {
    const distance = venn.distanceFromIntersectArea(r1, r2, overlap);
    const o = venn.circleOverlap(r1, r2, distance);
    expect(o).toBeCloseTo(overlap);
  }
  test("varius intersection areas", () => {
    testDistanceFromIntersectArea(1.9544100476116797, 2.256758334191025, 11);

    testDistanceFromIntersectArea(111.06512962798197, 113.32348546565727, 1218);

    testDistanceFromIntersectArea(44.456564007075, 149.4335753619362, 2799);

    testDistanceFromIntersectArea(592.89, 134.75, 56995);

    testDistanceFromIntersectArea(139.50778247443944, 32.892784970851956, 3399);

    testDistanceFromIntersectArea(4.886025119029199, 5.077706251929807, 75);
  });
});

describe("circleCircleIntersection", () => {
  function testIntersection(
    c1: { x: number; y: number; radius: number },
    c2: { x: number; y: number; radius: number },
  ) {
    const points = venn.circleCircleIntersection(c1, c2);
    for (const point of points) {
      expect(venn.distance(point, c1)).toBeCloseTo(c1.radius);
      expect(venn.distance(point, c2)).toBeCloseTo(c2.radius);
    }

    return points;
  }

  test("fully contained", () => {
    const points = venn.circleCircleIntersection(
      { x: 0, y: 3, radius: 10 },
      { x: 3, y: 0, radius: 20 },
    );

    expect(points.length).toEqual(0);
  });

  test("fully disjoint", () => {
    const points = venn.circleCircleIntersection(
      { x: 0, y: 0, radius: 10 },
      { x: 21, y: 0, radius: 10 },
    );

    expect(points.length).toEqual(0);
  });

  test("midway bewteen 2 points on y axis", () => {
    const points = testIntersection(
      { x: 0, y: 0, radius: 10 },
      { x: 10, y: 0, radius: 10 },
    );

    expect(points.length).toEqual(2);
    expect(points[0]!.x).toBeCloseTo(5);
    expect(points[1]!.x).toBeCloseTo(5);
    expect(points[0]!.y).toBeCloseTo(-1 * points[1]!.y);
  });

  test("failing case from input", () => {
    const points = testIntersection(
      { x: 0, y: 0, radius: 10 },
      { x: 10, y: 0, radius: 10 },
    );

    expect(points.length).toEqual(2);
  });
});

describe("disjointCircles", () => {
  test("total overlap is 0", () => {
    const circles = [
      { x: 0.909, y: 0.905, radius: 0.548 },
      { x: 0.765, y: 0.382, radius: 0.703 },
      { x: 0.63, y: 0.019, radius: 0.449 },
      { x: 0.21, y: 0.755, radius: 0.656 },
      { x: 0.276, y: 0.723, radius: 1.145 },
      { x: 0.141, y: 0.585, radius: 0.419 },
    ];

    const { overlap } = venn.intersectionArea(circles);
    expect(overlap).toEqual(0);
  });

  test("smallest circle is completely overlapped by each of the others", () => {
    const circles = [
      { x: 0.426, y: 0.882, radius: 0.944 },
      { x: 0.24, y: 0.685, radius: 0.992 },
      { x: 0.01, y: 0.909, radius: 1.161 },
      { x: 0.54, y: 0.475, radius: 0.41 },
    ];

    const { overlap } = venn.intersectionArea(circles);
    expect(overlap).toBeCloseTo(
      circles[3]!.radius * circles[3]!.radius * Math.PI,
    );
  });
});

describe("failures", () => {
  test(() => {
    const circles = [
      { x: 0.501, y: 0.32, radius: 0.629 },
      { x: 0.945, y: 0.022, radius: 1.015 },
      { x: 0.021, y: 0.863, radius: 0.261 },
      { x: 0.528, y: 0.09, radius: 0.676 },
    ];

    const { overlap } = venn.intersectionArea(circles);

    expect(overlap - 0.0008914).toBeLessThan(0.0001);
  });

  test(() => {
    const circles = [
      { x: 9.154829758385864, y: 0, size: 226, radius: 8.481629223064205 },
      {
        x: 5.806079662851866,
        y: 7.4438023223126795,
        size: 733,
        radius: 15.274853405932202,
      },
      {
        x: 9.484491297623553,
        y: 4.064806303558571,
        size: 332,
        radius: 10.280023453913834,
      },
      {
        x: 10.56492833796709,
        y: 3.0723147554880175,
        size: 244,
        radius: 8.812923024107548,
      },
    ];

    const { overlap } = venn.intersectionArea(circles);
    expect(overlap).toBeCloseTo(10.96362);
  });

  test("intersectionArea does not return NaN for valid intersections", () => {
    const circles = [
      {
        x: -0.0014183481763938425,
        y: 0.0006071174738860746,
        radius: 510.3115834996166,
      },
      {
        x: 875.0163281608848,
        y: 0.0007003612396158774,
        radius: 465.1793581792228,
      },
      {
        x: 462.7394999567192,
        y: 387.9359963330729,
        radius: 172.62633992134658,
      },
    ];

    const { overlap } = venn.intersectionArea(circles);
    expect(overlap).not.toBeNaN();
  });
});

test("normalizeSolution", () => {
  const solution = {
    0: { x: 0, y: 0, radius: 0.5 },
    1: { x: 1e10, y: 0, radius: 1.5 },
  };

  const normalized = venn.normalizeSolution(solution);
  const distance = venn.distance(normalized[0]!, normalized[1]!);

  expect(distance).lessThan(2.1);
});

test("disjointClusters", () => {
  const input = [
    {
      x: 0.8047033110633492,
      y: 0.9396705999970436,
      radius: 0.47156485118903224,
    },
    {
      x: 0.7961132447235286,
      y: 0.014027722179889679,
      radius: 0.14554832570720466,
    },
    {
      x: 0.28841276094317436,
      y: 0.98081015329808,
      radius: 0.9851036085514352,
    },
    {
      x: 0.7689983483869582,
      y: 0.2899463507346809,
      radius: 0.7210563338827342,
    },
  ];

  const clusters = venn.disjointCluster(input);
  expect(clusters.length).toEqual(1);
});

describe("computeTextCentre", () => {
  test(() => {
    const center = venn.computeTextCentre([{ x: 0, y: 0, radius: 1 }], []);

    expect(center).toBeCloseTo(center.x, 0);
    expect(center).toBeCloseTo(center.y, 0);
  });

  test(() => {
    const center = venn.computeTextCentre(
      [{ x: 0, y: 0, radius: 1 }],
      [{ x: 0, y: 1, radius: 1 }],
    );

    expect(center).toBeCloseTo(center.x, 1e-4);
    expect(center).toBeCloseTo(center.y, -0.5);
  });
});
