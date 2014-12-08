define("ghost/tests/test-helper", 
  ["ember-cli/test-loader","ember/resolver","ember-mocha"],
  function(__dependency1__, __dependency2__, __dependency3__) {
    "use strict";
    var TestLoader = __dependency1__["default"];
    var Resolver = __dependency2__["default"];
    var setResolver = __dependency3__.setResolver;

    var resolver = Resolver.create();
    resolver.namespace = {
      modulePrefix: 'ghost'
    };

    setResolver(resolver);

    TestLoader.load();

    window.expect = chai.expect;

    mocha.checkLeaks();
    mocha.globals(['jQuery', 'EmberInspector']);
    mocha.run();
  });
define("ghost/tests/unit/components/gh-trim-focus-input_test", 
  ["ember-mocha"],
  function(__dependency1__) {
    "use strict";
    /* jshint expr:true */
    var describeComponent = __dependency1__.describeComponent;
    var it = __dependency1__.it;

    describeComponent('gh-trim-focus-input', function () {
        it('trims value on focusOut', function () {
            var component = this.subject({
                value: 'some random stuff   '
            });

            this.render();

            component.$().focusout();
            expect(component.$().val()).to.equal('some random stuff');
        });
    });
  });
//# sourceMappingURL=ghost-tests.js.map