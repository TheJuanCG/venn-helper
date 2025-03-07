declare module "fmin" {
  /**
   * Nelder-Mead optimization algorithm
   * @param fn Function to minimize that takes an array of values and returns the function value
   * @param initial Initial point to start optimization from
   * @param parameters Optional parameters for the algorithm
   * @returns Object with optimization results, including x (solution vector) and fx (function value)
   */
  export function nelderMead(
    fn: (values: number[]) => number,
    initial: number[],
    parameters?: {
      maxIterations?: number;
      minErrorDelta?: number;
      minTolerance?: number;
      history?: any[];
      [key: string]: any;
    }
  ): { x: number[]; fx: number; iterations: number; };

  /**
   * Bisection method to find roots of a function
   * @param fn Function whose root is sought
   * @param min Lower bound of search interval
   * @param max Upper bound of search interval
   * @param parameters Optional parameters
   * @returns The approximate root of the function
   */
  export function bisect(
    fn: (x: number) => number,
    min: number,
    max: number,
    parameters?: { tolerance?: number; maxIterations?: number; }
  ): number;

  /**
   * Conjugate gradient optimization
   * @param fn Function to minimize, should update gradient vector fxprime
   * @param initial Initial point to start optimization from
   * @param parameters Optional parameters
   * @returns Object with optimization results
   */
  export function conjugateGradient(
    fn: (x: number[], fxprime: number[]) => number,
    initial: number[],
    parameters?: { 
      maxIterations?: number;
      gradientTolerance?: number;
      history?: any[];
      [key: string]: any;
    }
  ): { x: number[]; fx: number; iterations: number; };

  /**
   * Creates a vector of zeros
   * @param n Length of vector
   * @returns Array filled with zeros
   */
  export function zeros(n: number): number[];

  /**
   * Creates a matrix (2D array) of zeros
   * @param rows Number of rows
   * @param cols Number of columns
   * @returns 2D array filled with zeros
   */
  export function zerosM(rows: number, cols: number): number[][];

  /**
   * Computes the L2 (Euclidean) norm of a vector
   * @param x Vector to compute norm of
   * @returns L2 norm of the vector
   */
  export function norm2(x: number[]): number;

  /**
   * Scales a vector by a scalar constant
   * @param x Vector to scale
   * @param c Scalar value to multiply by
   * @returns Scaled vector (modifies input vector)
   */
  export function scale(x: number[], c: number): number[];
}
