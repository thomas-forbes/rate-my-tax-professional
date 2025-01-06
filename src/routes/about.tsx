import Layout from '~/components/Layout'

export default function About() {
  return (
    <Layout>
      <main class="max-w-4xl mx-auto px-4 py-8 prose prose-slate">
        <h2>About Us</h2>

        <p>
          <a href="https://ratemytaxprofessional.com">
            RateMyTaxProfessional.com
          </a>{' '}
          provides an easy-to-use list and reviews of U.S. tax professionals
          from all over the world.
        </p>

        <p>
          Hosted by the{' '}
          <a href="https://unofficialembassy.org/">Unofficial Embassy</a>, a
          non-profit dedicated to helping Americans abroad navigate the complex
          and costly U.S. tax system.
        </p>

        <h3>Who We Are</h3>
        <p>
          Founded by Rebecca Lammers who started the Unofficial Embassy in 2025
          after completing her 3 year term (2022-2024) as the International
          Member of the{' '}
          <a href="https://www.improveirs.org/">Taxpayer Advocacy Panel</a>, a
          federal advisory committee to the IRS. After making recommendations to
          the IRS to improve customer service and communications and having most
          recommendations rejected, Rebecca decided to continue to serve the
          American abroad community through building online tools and resources
          to help everyone save time and money in filing their US tax return.
        </p>

        <h3>Donate</h3>
        <p>
          Donations big or small are used to continue the goal of growing tax
          resources for the American abroad community.{' '}
          <a
            href="https://www.paypal.com/donate/?hosted_button_id=95MLZHGDZXX9W"
            class="text-primary underline"
          >
            Click here to donate
          </a>
          .
        </p>
      </main>
    </Layout>
  )
}
