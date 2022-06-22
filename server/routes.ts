const routes = require('next-routes');

export default routes()
  .add('account', '/model/account', '/model/account')
  .add('banking', '/model/banking', '/model/banking')
  .add('my-gallery', '/model/my-gallery', '/model/my-gallery')
  .add('my-order', '/model/my-order', '/model/my-order')
  .add('store-manager', '/model/my-store', '/model/my-store')
  .add('video-manager', '/model/my-video', '/model/my-video')
  .add('my-subscriber', '/model/my-subscriber', '/model/my-subscriber')
  .add('earning', '/model/earning', '/model/earning')
  .add('payout-request', '/model/payout-request', '/model/payout-request')
  .add('back-list', '/model/black-list', '/model/black-list')
  .add('violations-reported', '/model/violations-reported', '/model/violations-reported')
  .add('model', '/model/:username', '/model/profile')
  .add('video', '/video/:id', '/video')
  .add('gallery', '/gallery/:id', '/gallery')
  .add('product', '/store/:id', '/store/details')
  .add('page', '/page/:id', '/page');
