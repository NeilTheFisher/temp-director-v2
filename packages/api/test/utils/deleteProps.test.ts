import { describe, expect, it } from "vitest";
import { deleteProps } from "./deleteProps";

describe("deleteProps", () => {
  it("should delete specified properties from a simple object", () => {
    const input = { a: 1, b: 2, c: 3 };
    const result = deleteProps(input, ["b"]);
    expect(result).toEqual({ a: 1, c: 3 });
  });

  it("should delete multiple properties from an object", () => {
    const input = { a: 1, b: 2, c: 3, d: 4 };
    const result = deleteProps(input, ["b", "d"]);
    expect(result).toEqual({ a: 1, c: 3 });
  });

  it("should process arrays and delete properties from each element", () => {
    const input = [
      { a: 1, b: 2 },
      { a: 3, b: 4 },
    ];
    const result = deleteProps(input, ["b"]);
    expect(result).toEqual([{ a: 1 }, { a: 3 }]);
  });

  it("should recursively delete properties from nested objects", () => {
    const input = {
      a: 1,
      nested: {
        b: 2,
        c: 3,
      },
    };
    const result = deleteProps(input, ["b"]);
    expect(result).toEqual({
      a: 1,
      nested: {
        c: 3,
      },
    });
  });

  it("should handle deeply nested structures", () => {
    const input = {
      level1: {
        level2: {
          level3: {
            keep: "value",
            remove: "this",
          },
        },
      },
    };
    const result = deleteProps(input, ["remove"]);
    expect(result).toEqual({
      level1: {
        level2: {
          level3: {
            keep: "value",
          },
        },
      },
    });
  });

  it("should handle arrays nested within objects", () => {
    const input = {
      items: [
        { id: 1, secret: "a" },
        { id: 2, secret: "b" },
      ],
    };
    const result = deleteProps(input, ["secret"]);
    expect(result).toEqual({
      items: [{ id: 1 }, { id: 2 }],
    });
  });

  it("should return primitive values unchanged", () => {
    expect(deleteProps("string", ["any"])).toBe("string");
    expect(deleteProps(42, ["any"])).toBe(42);
    expect(deleteProps(true, ["any"])).toBe(true);
    expect(deleteProps(null, ["any"])).toBe(null);
    expect(deleteProps(undefined, ["any"])).toBe(undefined);
  });

  it("should handle empty objects and arrays", () => {
    expect(deleteProps({}, ["a"])).toEqual({});
    expect(deleteProps([], ["a"])).toEqual([]);
  });

  it("should not modify the original object", () => {
    const input = { a: 1, b: 2 };
    deleteProps(input, ["b"]);
    expect(input).toEqual({ a: 1, b: 2 });
  });

  it("should handle properties that don't exist", () => {
    const input = { a: 1, b: 2 };
    const result = deleteProps(input, ["nonexistent"]);
    expect(result).toEqual({ a: 1, b: 2 });
  });
});
