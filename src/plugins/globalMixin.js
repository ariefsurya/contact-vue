export default {
  data() {
    return {
      isMobile: window.innerWidth <= 768
    };
  },
  methods: {
    checkIsMobile() {
      this.isMobile = window.innerWidth <= 768;
    }
  },
  mounted() {
    this.checkIsMobile();
    window.addEventListener('resize', this.checkIsMobile);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.checkIsMobile);
  }
}  