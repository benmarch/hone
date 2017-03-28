import hone from '../../src/hone';

describe('hone', () => {
    describe('Greet function', () => {
        beforeEach(() => {
            spy(hone, 'greet');
            hone.greet();
        });

        it('should have been run once', () => {
            expect(hone.greet).to.have.been.calledOnce;
        });

        it('should have always returned hello', () => {
            expect(hone.greet).to.have.always.returned('hello');
        });
    });
});
