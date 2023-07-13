/* eslint-disable @typescript-eslint/no-explicit-any */
import { assert } from "chai";
import { faker } from "@faker-js/faker";
import { FilterLogger } from "../../src/filter/filter-logger";

const MASK = "**sensitive**";

describe("Unit: FilterLogger", () => {
  describe("clear", () => {
    describe("params", () => {
      it("Should return undefined if params is undefined", () => {
        // Given
        const params = undefined;

        const filter = new FilterLogger();

        // When
        const result = filter.clear(params);

        // Then
        assert.deepEqual(result, undefined);
      });

      it("Should not mask if property name out of blacklist", () => {
        // Given
        const params = {
          name: faker.person.fullName(),
        };

        const filter = new FilterLogger();

        // When
        const result = filter.clear(params);

        // Then
        assert.deepEqual(result, params);
      });

      describe("Object", () => {
        it("Should mask simple object to default blacklist value", () => {
          // Given
          const params = {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            "x-api-key": faker.string.uuid(),
          };

          const expected = {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            "x-api-key": MASK,
          };

          const filter = new FilterLogger();

          // When
          const result = filter.clear(params);

          // Then
          assert.deepEqual(result, expected);
        });

        it("Should process empty object to default blacklist value", () => {
          // Given
          const params = {};

          const expected = {};

          const filter = new FilterLogger();

          // When
          const result = filter.clear(params);

          // Then
          assert.deepEqual(result, expected);
        });

        it("Should mask three levels object to default blacklist value", () => {
          // Given
          const params = {
            configs: {
              values: {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                "x-api-key": faker.string.uuid(),
              },
            },
          };

          const expected = {
            configs: {
              values: {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                "x-api-key": MASK,
              },
            },
          };

          const filter = new FilterLogger();

          // When
          const result = filter.clear(params);

          // Then
          assert.deepEqual(result, expected);
        });
      });

      describe("Array", () => {
        it("Should process empty array", () => {
          // Given
          const params = [];

          const expected = [];

          const filter = new FilterLogger();

          // When
          const result = filter.clear(params);

          // Then
          assert.deepEqual(result, expected);
        });

        describe("Simple values", () => {
          it("Should return array simple values", () => {
            // Given
            const params = ["a", "b"];

            const filter = new FilterLogger();

            // When
            const result = filter.clear(params);

            // Then
            assert.deepEqual(result, params);
          });

          it("Should return array object values", () => {
            // Given
            const params = {
              values: {
                list: MASK,
              },
            };

            const filter = new FilterLogger();

            // When
            const result = filter.clear(params);

            // Then
            assert.deepEqual(result, params);
          });

          it("Should mask values", () => {
            // Given
            const params = {
              values: {
                list: ["a", "b", "c"],
              },
            };

            const expected = {
              values: {
                list: MASK,
              },
            };

            const filter = new FilterLogger(["list"]);

            // When
            const result = filter.clear(params);

            // Then
            assert.deepEqual(result, expected as any);
          });
        });

        describe("Object values", () => {
          it("Should return array object values", () => {
            // Given
            const params = [
              {
                id: "11",
              },
              {
                id: "10",
              },
            ];

            const filter = new FilterLogger();

            // When
            const result = filter.clear(params);

            // Then
            assert.deepEqual(result, params);
          });

          it("Should mask values", () => {
            // Given
            const params = {
              values: {
                list: [
                  {
                    document: "234234234",
                    id: "10",
                    token: "token",
                  },
                  {
                    document: "0-94",
                    id: "11",
                    token: "fake-token",
                  },
                ],
              },
            };

            const expected = {
              values: {
                list: [
                  {
                    document: MASK,
                    id: MASK,
                    token: MASK,
                  },
                  {
                    document: MASK,
                    id: MASK,
                    token: MASK,
                  },
                ],
              },
            };

            const filter = new FilterLogger(["document", "token", "id"]);

            // When
            const result = filter.clear(params);

            // Then
            assert.deepEqual(result, expected);
          });
        });
      });
    });

    describe("Mask person", () => {
      it("Should mask person data", () => {
        // Given
        const person = {
          addresses: [
            {
              code: faker.string.uuid(),
              zipCode: faker.location.zipCode(),
            },
          ],
          code: faker.string.uuid(),
          document: {
            number: faker.number.int(),
            type: 1,
          },
          name: faker.person.fullName(),
          token: faker.string.uuid(),
        };

        const expected = {
          addresses: MASK,
          code: MASK,
          document: {
            number: MASK,
            type: 1,
          },
          name: MASK,
          token: MASK,
        };

        const filter = new FilterLogger(["addresses", "number", "code", "name"]);

        // When
        const result = filter.clear(person);

        // Then
        assert.deepEqual(result, expected as any);
      });
    });
  });
});
