-- CreateTable
CREATE TABLE "Pizza" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "PizzaPrice" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "pizza_id" INTEGER NOT NULL,
    "small_price" REAL,
    "medium_price" REAL,
    "large_price" REAL,
    "note" TEXT,
    CONSTRAINT "PizzaPrice_pizza_id_fkey" FOREIGN KEY ("pizza_id") REFERENCES "Pizza" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
