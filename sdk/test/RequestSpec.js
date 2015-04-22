describe('Request', function() {
    'use strict';

    var ASR, xhr, requests;
    var testURL;

    /*
     * Tests that the promise is resolved for a given response code.
     */
    var testResponseCode = function(method, responseCode) {
        var request = ASR(testURL);
        var promise = request[method.toLowerCase()]();

        promise.should.be.instanceOf(Promise);

        // Check that a request was sent properly
        requests.length.should.equal(1);
        var fakeXhr = requests[0];
        fakeXhr.url.should.equal(testURL);
        fakeXhr.method.should.equal(method);
        Should(fakeXhr.requestBody).not.be.ok; // body should be null or ''

        // Fake a successful response
        fakeXhr.respond(responseCode, {'Content-Type': 'application/json'}, JSON.stringify('Success!'));

        // Check the response
        return promise.then(function(data) {
            Should(data).equal('Success!');
        });
    };

    /*
     * Tests that the promise is rejected for a given response code.
     */
    var testErrorResponseCode = function(method, responseCode) {
        var request = ASR(testURL);
        var promise = request[method.toLowerCase()]();

        promise.should.be.instanceOf(Promise);

        // Check that a request was sent properly
        requests.length.should.equal(1);
        var fakeXhr = requests[0];
        fakeXhr.url.should.equal(testURL);
        fakeXhr.method.should.equal(method);
        Should(fakeXhr.requestBody).not.be.ok; // body should be null or ''

        // Fake a successful response
        fakeXhr.respond(responseCode, {'Content-Type': 'application/json'}, 'Failure!');

        // Check that the promise was rejected
        return promise.then(function(/*data*/) {
            return Promise.reject(new Error('Promise should not resolve'));
        }, function(/*error*/) {
            // TODO: Check the message on the error. Need to figure out what we want to return
            return Promise.resolve(); // Not strictly necessary, but makes it a bit clearer what's happening
        });
    };

    /*
     * Tests that 200, 201, 202, and 204 resolve and that 400, 401, 403, and 404 reject.
     */
    var testAllResponseCodesForMethod = function(method) {
        it(method + ' with 200 response should succeed', function () {
            return testResponseCode(method, 200);
        });

        it(method + ' with 201 response should succeed', function () {
            return testResponseCode(method, 201);
        });

        it(method + ' with 202 response should succeed', function () {
            return testResponseCode(method, 202);
        });

        it(method + ' with 204 response should succeed', function () {
            return testResponseCode(method, 204);
        });

        it(method + ' with 400 response should fail', function () {
            return testErrorResponseCode(method, 400);
        });

        it(method + ' with 401 response should fail', function () {
            return testErrorResponseCode(method, 401);
        });

        it(method + ' with 403 response should fail', function () {
            return testErrorResponseCode(method, 403);
        });

        it(method + ' with 404 response should fail', function () {
            return testErrorResponseCode(method, 404);
        });
    };

    before(function() {
        ASR = ADSKSpark.Request;
        testURL = 'http://localhost';
    });

    beforeEach(function() {
        xhr = sinon.useFakeXMLHttpRequest();
        requests = [];
        xhr.onCreate = function(request) {
            requests.push(request);
        };
    });

    afterEach(function() {
        xhr.restore();
    });

    it('should exist', function() {
        Should.exist(ASR);

        var request = ASR(testURL);

        Should.exist(request);
        request.should.be.Object.with.properties(['get', 'post', 'put', 'delete']);
    });

    context('GET', function() {
        testAllResponseCodesForMethod('GET');
    });

    context('POST', function() {
        testAllResponseCodesForMethod('POST');
    });

    context('PUT', function() {
        testAllResponseCodesForMethod('PUT');
    });

    context('DELETE', function() {
        testAllResponseCodesForMethod('DELETE');
    });

});
