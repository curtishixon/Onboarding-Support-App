import { MockDataProvider } from "./mock-data-provider";
import type { DataProvider } from "./data-provider";

// Swap this line when the real database is ready:
export const dataProvider: DataProvider = new MockDataProvider();
