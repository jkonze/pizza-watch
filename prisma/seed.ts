import * as fs from "fs";
import path from "path";
import {PrismaClient} from "@prisma/client"
const prisma = new PrismaClient()

const filePath = path.join(__dirname, 'data/entries/')
const files = fs.readdirSync(filePath)

type PizzaDataEntry = {
    id: number
    name: string
    small_price: number
    medium_price: number
    large_price: number
}

const pizzas = ['Margherita', 'Salami', 'Prosciutto', 'Funghi', 'Capri', 'Hawai', 'Tonno', '4 Stagioni', '4 Formaggi', 'Rustica', 'Deliziosa', 'Italia', 'Capricciosa', 'Diavolo', 'Calzone', 'Popeye', 'Vegetaria', 'Gamberetti', 'Marinara', 'Mozarella', 'Parma', 'Chef', 'Mia', 'Vesna', 'al Salmone', 'Mediterano', 'Räucherlachs', 'Zlatko', 'Pizzabrot']

async function seed() {
    for (const pizza of pizzas) {
        await prisma.pizza.create({
            data: {
                name: pizza
            }
        })
    }

    for (const fileName of files) {
        const date = fileName.match(/(\d+)-(\d+)-(\d+)/)
        if (date && date[1] && date[2] && date[3]) {
            const timeStamp = new Date(`${date[3]}-${date[2]}-${date[1]}`)
            const rawFile = fs.readFileSync(filePath + fileName)
            const json: PizzaDataEntry[] = JSON.parse(rawFile.toString())
            const pizzaCollection = await prisma.pizza.findMany({})
            console.log(timeStamp.toISOString())

            for (const pizza of json) {
                const relatedID = pizzaCollection.find((p) => p.name === pizza.name)?.id
                if (relatedID) {
                    await prisma.pizzaPrice.create({
                        data: {
                            pizza_id: relatedID,
                            date: timeStamp.toISOString(),
                            small_price: pizza.small_price || null,
                            medium_price: pizza.medium_price || null,
                            large_price: pizza.large_price || null
                        }
                    })
                }
            }
        }
    }
}

seed()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })