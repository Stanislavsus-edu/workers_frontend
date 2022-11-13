import News from './News';

const news = new News(document.querySelector('section.news'));
news.init();

(async () => {
  try {
    if (navigator.serviceWorker) {
      await navigator.serviceWorker.register(
        '/src/service-worker.js',
        {
          scope: '/src/',
        }
      );
    }
  } catch (e) {
    console.error(e);
  }
})();
