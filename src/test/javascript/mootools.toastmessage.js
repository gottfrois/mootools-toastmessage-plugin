/**
 *  This Mootools Plugin will help you in showing some nice Toast-Message like notification messages. The behavior is
 *  similar to the android Toast class.
 *  You have 4 different toast types you can show. Each type comes with its own icon and colored border. The types are:
 *  - notice
 *  - success
 *  - warning
 *  - error
 *
 *   To see some more examples please have a look into the Tests in src/test/javascript/ToastmessageTest.js
 *
 *   For further style configuration please see corresponding css file: mootools-toastmessage.css
 *
 *  Forked from https://github.com/akquinet/jquery-toastmessage-plugin
 *
 *  Version: 0.0.1
 **/
var ToastMessage = new Class({

  Implements: Options,

  options: {
      inEffect:         {opacity: 'show'}, // in effect
      inEffectDuration: 600,               // in effect duration in miliseconds
      stayTime:         7000,              // time in miliseconds before the item has to disappear
      text:             '',                // content of the item. Might be a string or a jQuery object. Be aware that any jQuery object which is acting as a message will be deleted when the toast is fading away.
      sticky:           false,             // should the toast item sticky or not?
      type:             'notice',          // notice, warning, error, success
      position:         'top-right',       // top-left, top-center, top-right, middle-left, middle-center, middle-right ... Position of the toast container holding different toast. Position can be set only once at the very first call, changing the position after the first call does nothing
      closeText:        '',                // text which will be shown as close button, set to '' when you want to introduce an image via css
      close:            null               // callback function when the toastmessage is closed
  },

  initialize: function(options){
    this.setOptions(options);
  },


  showToast: function(){
    var toastWrapAll, toastItemOuter, toastItemInner, toastItemClose, toastItemImage, toastText;

    if(!$$('.toast-container').length){
      toastWrapAll = new Element('div',{'class':'toast-container ' + 'toast-position-' + this.options.position})
      $(document.body).grab(toastWrapAll);
    }
    else{
      toastWrapAll = $$('.toast-container');
    }

    toastItemOuter  = new Element('div',{'class':'toast-item-wrapper'});
    toastItemInner  = new Element('div').addClass('toast-item toast-type-' + this.options.type);
    toastTest = new Element('p', {html: this.options.text} );
    toastItemInner.grab(toastTest);
    toastWrapAll.grab(toastItemInner);

    new Fx.Slide(toastItemInner).hide().slideIn();

    toastItemClose  = new Element('div',{'class':'toast-item-close'});
    toastItemInner.grab(toastItemClose,'top');

    var self = this;
    toastItemClose.addEvent('click',function(){
      self.removeToast(toastItemInner);
    });

    toastItemImage  = new Element('div',{'class':'toast-item-image ' + 'toast-item-image-' + this.options.type});
    toastItemInner.grab(toastItemImage,'top');

    if(!this.options.sticky){
      setTimeout(function(){
        self.removeToast(toastItemInner);},
        this.options.stayTime);
    }
    return toastItemInner;
  },

  removeToast: function(el){
    var fx = new Fx.Tween(el);
    fx.start('opacity',0).chain(function(){
      var parentFx = new Fx.Tween(el.getParent());
      parentFx.start('height',0).chain(function(){
        el.getParent().destroy();
      });
    });

    // callback
    if (this.options && this.options.close !== null){
        this.options.close();
    }
  }

});

window.addEvent('domready',function(){
  new ToastMessage({type:'warning', text:'Mootools FTW','sticky':true}).showToast();
  new ToastMessage({type:'notice', text:'Mootools is cool'}).showToast();
  new ToastMessage({type:'error', text:'Mootools rocks !'}).showToast();
});