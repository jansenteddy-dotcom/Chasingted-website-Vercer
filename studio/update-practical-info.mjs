import {createClient} from '@sanity/client'

const client = createClient({
  projectId: '2c36900p',
  dataset: 'production',
  apiVersion: '2024-06-01',
  token: 'skHg97U3fMrYBOHYfEfXjbDcShfrAcAc3xWqXEhYpF0TEtylJQejGNkjRVetrKUswVDsD74JIwAmgJ2MBlBJEiROShAUClzZy7BYclKc7ZuixBPyOpHRyWSFXQXmMx7zl6qX8UiREfvZw50MCdBX8jqzRI8U8C8EXirPZ9FvMPKy1IlxE5lV',
  useCdn: false,
})

const CANCELLATION = 'Full refund up to 60 days before departure. 50% refund 30–59 days. No refund within 30 days. Travel insurance strongly recommended.'

await client.patch('trip-kyrgyzstan').set({
  fitnessLevel: 'Good general fitness and prior off-road riding experience required. Days are long, altitude is real — we cross passes above 3,000m.',
  cancellationPolicy: CANCELLATION,
  gearList: [
    'Own off-road riding gear (helmet, jacket, pants, gloves, boots)',
    'Sunglasses + tinted visor',
    'Personal first-aid + altitude meds',
    'Layers for cold passes',
    'Hydration pack',
  ],
}).commit()
console.log('✓ Kyrgyzstan updated')

await client.patch('trip-oman').set({
  fitnessLevel: 'Moderate fitness required — comfortable with long vehicle days and warm afternoons in camp. No prior driving experience needed.',
  cancellationPolicy: CANCELLATION,
  gearList: [
    'Lightweight, breathable clothing',
    'Sun protection (hat, sunscreen, sunglasses)',
    'Closed-toe shoes for dune walking',
    'Warm layer for cold desert nights',
    'Personal medications',
    'Camera or phone for the landscapes',
  ],
}).commit()
console.log('✓ Oman updated')

await client.patch('trip-mazury').set({
  fitnessLevel: 'Around 6 hours of relaxed daily paddling. No prior kayaking experience required — just a reasonable level of general fitness.',
  cancellationPolicy: CANCELLATION,
  gearList: [
    'Waterproof jacket and trousers',
    'Comfortable paddling clothes',
    'Water shoes or sandals',
    'Sun protection (hat, sunscreen)',
    'Dry bag for valuables',
    'Sleeping bag (camp nights)',
    'Personal medications',
  ],
}).commit()
console.log('✓ Mazury updated')

console.log('\n✅ All practical info added.')
