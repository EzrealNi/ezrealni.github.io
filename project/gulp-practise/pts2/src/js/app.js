$(function() {
  initPage();
});

var view = {
  initPage: function() {
    this.bindEvent();
    const firstItem = $('.v-tree ul.v-tree-content > li.v-tree-item:nth-of-type(1)');
    const firstType = firstItem.find(
      '.item-expand ul.item-options > li.item-option:nth-of-type(1) > span'
    );
    firstItem.click();
    firstType.click();
  },

  bindEvent: function() {
    $('.box').on('click', 'li.v-tree-item', function() {
      const $this = $(this);
      $this
        .siblings('li.v-tree-item')
        .find('.item-expand')
        .css('height', 0);
      const innerHeight = $this.find('ul.item-options').outerHeight();
      $this.find('.item-expand').css('height', innerHeight);
    });

    $('.box').on('click', 'li.item-option > span', function() {
      $(this)
        .parent()
        .toggleClass('active');
      var parentNode = $(this).parents('li.v-tree-item');
      if (parentNode.find('li.item-option').hasClass('active')) {
        parentNode.addClass('active');
      } else {
        parentNode.removeClass('active');
      }
    });
  }
};

Object.assign(window, view);
