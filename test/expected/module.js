(function (this, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery', 'jquery-ui'], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        require('jquery-ui');
        module.exports = factory(require('jquery'));
    } else {
        // Browser globals (root is window)
        this.myModule = factory(this.$);
    }
}(this, function($) {

var mod = {};

mod.part1 = 'part1 content';

mod.part1 = 'part1 content';


return mod;

}));
