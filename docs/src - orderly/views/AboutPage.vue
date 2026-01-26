<template>
  <!-- HEADER -->
  <div class="header">
    <img src="@/assets/logo.png" alt="Logo" class="logo" />
  </div>

  <!-- CONTENT AREA -->
  <div class="container py-5 text-black">
    <div class="d-flex flex-wrap gap-2 mb-4 justify-content-center">
      <button
        v-for="section in sections"
        :key="section"
        :class="[
          'btn btn-sm chip-btn',
          activeSection === section ? 'active-chip-btn' : 'btn-outline-light'
        ]"
        @click="navigateToSection(section)"
      >
        {{ section }}
      </button>
    </div>

    <!-- Terms of Use -->
    <div v-if="activeSection === 'Terms of Use'" :id="sectionHashes['Terms of Use']">
      <h3>Terms of Use</h3>
      <div>
        <p><strong>Last update: 10/05/2025</strong></p>
        <p>
          Welcome to Ordered. By using this website, you accept the following terms and
          conditions. We invite you to read them carefully before proceeding with browsing or
          purchasing.
        </p>
        <ol>
          <li><strong>Service</strong><br />Orderly is an online platform...</li>
          <li><strong>Orders and Payments</strong><br />By placing an order...</li>
          <li><strong>Shipping and Returns</strong><br />We ship throughout Italy...</li>
          <li><strong>Account User</strong><br />If you choose to create an account...</li>
          <li><strong>Changes to the Terms</strong><br />Orderly reserves the right...</li>
        </ol>
      </div>
    </div>

    <!-- Privacy Policy -->
    <div v-else-if="activeSection === 'Privacy Policy'" :id="sectionHashes['Privacy Policy']">
      <h3>Privacy Policy</h3>
      <div>
        <p><strong>Last update: 10/05/2025</strong></p>
        <p>Your privacy is important to us...</p>
        <ol>
          <li><strong>Data Controller</strong><br />The data controller is Orderly...</li>
          <li><strong>Data Collected</strong><br />We collect data necessary...</li>
          <li><strong>Purpose of Processing</strong><br />Your data is used for...</li>
          <li><strong>Data Retention</strong><br />Your data is stored only...</li>
          <li><strong>Data Sharing</strong><br />The data may be shared...</li>
          <li><strong>User Rights</strong><br />You have the right to access...</li>
        </ol>
      </div>
    </div>

    <!-- About Ephemeral -->
    <div v-else-if="activeSection === 'About Ephemeral'" :id="sectionHashes['About Ephemeral']">
      <h3>About Ephemeral</h3>
      <div>
        <p>Ephemeral was born in Povo...</p>
        <p>Despite the limited budget...</p>
        <p>The artisanal, independent, and relational approach...</p>
        <p>Ephemeral is not just a clothing brand...</p>
      </div>
    </div>

    <!-- About Us -->
    <div v-else-if="activeSection === 'About Us'" :id="sectionHashes['About Us']">
      <div class="row justify-content-center">
        <div
          class="col-sm-6 col-md-4 text-center mb-4 d-flex flex-column align-items-center"
          v-for="person in team"
          :key="person.name"
        >
          <!-- 3D Avatar -->
          <model-viewer
            :src="person.avatar"
            alt="3D Avatar"
            auto-rotate
            camera-controls
            interaction-prompt="none"
            style="width: 500px; height: 500px; background: transparent"
          ></model-viewer>
          <h5 class="mt-2">{{ person.name }}</h5>
          <p class="text-black">{{ person.role }}</p>
        </div>
      </div>

      <div class="my-5 text-center">
        <h3 class="text-black mb-3"><strong>Where to find us</strong></h3>
        <div class="ratio ratio-16x9 mb-3" style="max-width: 800px; margin: auto;">
          <iframe
            src="https://www.google.com/maps/embed/v1/place?key=AIzaSyDq8He0q-BdHbt4V2ugoSYOVpolF41EOG4&q=Corso+Bettini+84+38068+Rovereto+TN&maptype=satellite"
            allowfullscreen
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            style="border: 0"
          ></iframe>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AboutUsPage',
  data() {
    return {
      activeSection: 'Terms of Use',
      sections: ['Terms of Use', 'Privacy Policy', 'About Us', 'About Ephemeral'],
      sectionHashes: {
        'Terms of Use': 'terms-of-use',
        'Privacy Policy': 'privacy-policy',
        'About Us': 'about-us',
        'About Ephemeral': 'about-ephemeral'
      },
      team: [
        {
          name: 'Riccardo Bassetti',
          role: 'Chief Technology Officer (CTO)',
          avatar: 'https://riccardolbassetti.github.io/3d-models/travis_scott.glb'
        },
        {
          name: 'Gabriele Ferremi',
          role: 'Technical Writer / Product Documentation Manager',
          avatar: 'https://riccardolbassetti.github.io/3d-models/snoop_dogg.glb'
        },
        {
          name: 'Nicola Fontana',
          role: 'Chief Operating Officer (COO) / Lead Developer',
          avatar: 'https://riccardolbassetti.github.io/3d-models/kanye_west_cutout.glb'
        }
      ]
    };
  },
  methods: {
    navigateToSection(section) {
      this.activeSection = section;
      const hash = this.sectionHashes[section];
      if (hash) {
        window.history.replaceState(null, null, `#${hash}`);
      }
    }
  },
  mounted() {
  const sectionQuery = this.$route.query.section;
  const matchedSection = Object.keys(this.sectionHashes).find(
    key => this.sectionHashes[key] === sectionQuery
  );
  if (matchedSection) {
    this.activeSection = matchedSection;
  }
}
};
</script>

<style scoped>
.d-flex.flex-wrap {
  justify-content: center;
  align-items: center;
}
.chip-btn {
  border-radius: 50px;
  padding: 0.4rem 1rem;
  font-size: 20px;
  font-weight: bold;
  transition: background-color 0.3s;
  color: #111111;
}
.chip-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
}
.header {
  text-align: center;
  margin-bottom: 40px;
}
.logo {
  max-width: 200px;
  width: 100%;
  height: auto;
  display: block;
  margin: 60px auto 30px auto;
}
h3,
.section-title {
  margin-top: 40px;
  margin-bottom: 40px;
}
.page-title {
  font-size: 2rem;
  color: #111111;
}
.content {
  margin-top: 30px;
  text-align: left;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}
.section-title {
  font-size: 1.5rem;
  margin-top: 20px;
}
.cta-container {
  margin-top: 30px;
}
.cta-btn {
  background-color: #ff6600;
  color: #111111;
  border: none;
  padding: 10px 20px;
  font-size: 1rem;
  border-radius: 25px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
.cta-btn:hover {
  background-color: #ff4500;
}
.accordion-button {
  color: #111111;
  background-color: #1e1d1f;
}
.accordion-item {
  border: none;
}
.accordion-button:not(.collapsed) {
  background-color: #1e1d1f !important;
  color: #111111 !important;
  box-shadow: none !important;
}
.accordion-button::after {
  filter: invert(1);
}
.accordion-body {
  background-color: #000 !important;
  color: #111111 !important;
}
.d-flex.align-items-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
.model-viewer {
  width: 500px;
  height: 500px;
  background: transparent;
}
.active-chip-btn {
  background-color: #f58907 !important;
  color: white !important;
  border-color: #f58907 !important;
}
</style>

