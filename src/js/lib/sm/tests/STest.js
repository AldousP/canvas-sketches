var STest = {};

STest.run = function (tests) {
    var start = new Date().getTime();

    if (tests.length) {
      console.log('[STest] Running ' + tests.length + ' tests...');
      var passes = 0;
      var fails = 0;
      var skips = 0;
      tests.forEach(function (test, index) {
        try {
          if (test(STest.it) === 'skip' ) {
            console.log('[no.' + (index + 1) + '] It ' + STest.current_it + '... Skipping \uA71C');
            skips++;
          } else {
            console.log('[no.' + (index + 1) + '] It ' + STest.current_it + '... \uD83D\uDC4D');
            passes++;
          }

        } catch (e) {
          console.log('[no.' + (index + 1)+ '] It ' + STest.current_it + '... \uD83D\uDC4E');
          console.log(e);
          fails++;
        }
      });

      var elapsed = new Date().getTime() - start;
      var indent = '---';
      console.log('[STest] Results:');
      console.log(indent,
        tests.length +
        (tests.length === 1 ? ' test' : ' tests') +
        ' ran in ' + (elapsed / 1000) + 's');
      console.log(indent, SFormat.float_two_pt(((passes / tests.length) * 100)) + '% passing tests');
      console.log(indent, SFormat.float_two_pt(((fails/ tests.length) * 100)) + '% failing tests');
      console.log(indent, skips + '/' + tests.length + ' tests were skipped');
    } else {
      console.log('[STest] No properties found on the provided test object');
    }
};

STest.it = function (task) {
  STest.current_it = task;
};

STest.assert = function (condition) {
  if (!condition) {
    throw new Error('ConditionNotMetException');
  }
};

