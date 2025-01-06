import { db } from '~/api/db'
import { Professionals } from '~/drizzle/schema'

// Function to convert the string format
function convertNameFormat(name: string) {
  // Split the string into parts using comma as a delimiter
  const [lastName, rest] = name.split(', ')
  if (!lastName || !rest) {
    throw new Error(
      "Invalid format. Ensure the name is in 'LASTNAME, FIRSTNAME MIDDLENAME' format.",
    )
  }

  // Split the rest of the string into first and middle names
  const [firstName, ...middleNames] = rest.split(' ')

  // Combine the names in the desired order
  const formattedName = [
    capitalize(firstName),
    ...middleNames.map(capitalize),
    capitalize(lastName),
  ].join(' ')

  return formattedName
}

// Helper function to capitalize the first letter of a word
function capitalize(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
}

async function main() {
  const file = await Bun.file('./results.json').text()
  const data = JSON.parse(file)
  for (const country in data) {
    console.log(country, data[country].length)
    for (const professional of data[country]) {
      const prof = {
        name: convertNameFormat(professional.name),
        credential: professional.credential,
        address: professional.address,
        country,
        fromIrs: true,
      }
      await db.insert(Professionals).values(prof)
    }
  }
}

main()
