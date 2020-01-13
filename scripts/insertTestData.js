const MongoClient = require('mongodb').MongoClient;
const faker = require('faker')
faker.locale = 'es'


const url = "mongodb://localhost:27017";

async function init() {
	try {
		console.log('Init insert')
		const client = new MongoClient(url, { useUnifiedTopology: true })
		const clientSession = await client.connect()
		const db = await clientSession.db('indexninja')

		await insertDummyData(db)

		await clientSession.close()
		console.log('Finished')
	} catch (err) {
		throw err
	}
}

async function insertDummyData (db) {
	let dummyData =	[]
	// To avoid memoryHeap we insert in each 500
	let insertCount = 500
	for (let i= 0; i < 2000000; i++) {
		insertCount--
		if ([10,20,30,40,50].includes(i)) {
			dummyData.push({
				firstName: 'Juanchu',
				lastName: 'Master',
				alias: 'El Juanchu',
				email: 'JuanchuMaster@email.com',
				city: faker.address.city(),
				bio: `Los índices son una forma muy eficiente de buscar los datos Juanchu por un valor específico y nos evita tener que recorrer toda la colección en busca de un dato específico.
				Los índices en las bases de datos tradicionales se basan en Binary Tree Sort, y Mongo también.
				Veamos de una forma muy resumida como funcionaría este tipo de algoritmo.`,
				tags: [{
					front: 'Vuejs',
					back: 'Node'
				},{
					front: 'ReactJS',
					back: 'Golang'
				}]
			})
		} else if ([60,70,80,90,100].includes(i)){
			dummyData.push({
				firstName: 'Ninja',
				lastName: 'Master',
				alias: 'Juanchu master',
				city: 'Madrid',
				email: 'NinjaMaster@email.com',
				bio: `Full text Index: Indices de texto libre. Nos permite buscar el texto que hay en los documentos, es una búsqueda tipo Google. Al generar este tipo de índice crea una base de datos grande con todos los documentos de tipo texto (según los criterios que indiquemos) y a la hora de buscar nos muestras los elementos por relevancia (cuanto más aparezca la palabra que buscamos en el documento, más relevante se vuelve)`,
				tags: [{
					front: 'Vuejs',
					back: 'Node'
				},{
					front: 'ReactJS',
					back: 'Golang'
				}]
			})
		} else {
			dummyData.push({
				firstName: faker.name.firstName(),
				lastName: faker.name.lastName(),
				city: 'Madrid',
				email: faker.internet.email(),
				bio: faker.lorem.paragraphs(2),
				tags: [{
					front: faker.lorem.word(),
					back: faker.lorem.word()
				},{
					front: faker.lorem.word(),
					back: faker.lorem.word()
				}]
			})
		}
		if (insertCount === 0 && dummyData.length > 0) {
			try {
				await db.collection('noindex').insertMany(dummyData)
				await db.collection('index').insertMany(dummyData)
				insertCount = 500
				dummyData = []
			} catch (err) {
				console.log(err)
			}
		}
	}
	}

	init()