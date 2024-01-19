export type Summary = {
  id: string;
  successRate: number;
  completionTime: number;
};

export type Test = {
  type: "test";
  id: string;
  path: string;
  testName: string;
  runInParallel: boolean;
  testType: "Python" | "Flojoy" | "Matlab";
  status: "pending" | "processing" | "pass" | "failed";
  completionTime: number;
  isSavedToCloud: boolean;
};

export type Conditional = {
  type: "conditional";
  conditionalType: CONDITIONAL_TYPES;
  role: ROLE_TYPES;
  id: string;
  groupId: string;
  condition: string;
};

export type ROLE_TYPES = "start" | "between" | "end"; //for example, "if" is a "start", "else" is a "between" and "end" is an "end"
export type CONDITIONAL_TYPES = "if" | "else" | "elif" | "end";
export const CONDITIONALS = ["if"];

export type TestSequenceElement = Test | Conditional;

/* DEFINITIONS FOR TREE STRUCTURE OF TEST SEQUENCER */

export type IfNode = Conditional & {
  conditionalType: "if";
  main: TestSequenceElementNode[];
  else: TestSequenceElementNode[];
};

export type ConditionalNode = IfNode;

export type TestNode = Test;

export type TestRootNode = {
  type: "root";
  children: TestSequenceElementNode[];
};

export type TestSequenceElementNode = ConditionalNode | TestNode | TestRootNode;
