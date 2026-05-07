import { getOutbreakStats, getOutbreakNews } from '@/lib/getOutbreakData'
import HomeClient from '@/components/HomeClient'

// Revalidate every 60 seconds — live data without redeploy
export const revalidate = 60

export default async function Page() {
  const [stats, news] = await Promise.all([
    getOutbreakStats(),
    getOutbreakNews(),
  ])

  return <HomeClient stats={stats} news={news} />
}
