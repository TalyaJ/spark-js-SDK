var ADSKSpark = ADSKSpark || {};

(function () {
    var Client = ADSKSpark.Client;

    /**
     * A paginated array of jobs.
     * @param {Object} data - JSON data.
     * @constructor
     */
    ADSKSpark.Jobs = function (data) {
        ADSKSpark.Paginated.call(this, data);
    };

    ADSKSpark.Jobs.prototype = Object.create(ADSKSpark.Paginated.prototype);
    ADSKSpark.Jobs.prototype.constructor = ADSKSpark.Jobs;

    /**
     * Get jobs registered to a member.
     * @param {Object} params - limit/offset/sort/filter options.
     * @returns {Promise} - A promise that will resolve to an array of jobs.
     */
    ADSKSpark.Jobs.get = function (params) {
        return Client.authorizedApiRequest('/print/jobs')
            .get(params)
            .then(function (data) {
                return new ADSKSpark.Jobs(data);
            });
    };

    ADSKSpark.Jobs.prototype._parse = function (data) {
        ADSKSpark.Paginated.prototype._parse.call(this, data);

        var jobs = data.jobs || data.printer_jobs;
        if (Array.isArray(jobs)) {
            var that = this;
            jobs.forEach(function (job) {
                if (!job.printer_id) {
                    job.printer_id = data.printer_id;
                }
                if (!job.member_id) {
                    job.member_id = data.member_id;
                }
                that.push(new ADSKSpark.Job(job));
            });
        }
    };

    ADSKSpark.Job = function (data) {
        this.id = data.job_id;
        this.printer_id = data.printer_id;
        this.data = data;
        this.status = null;
    };

    ADSKSpark.Job.prototype = {

        constructor: ADSKSpark.Job,

        /**
         * Get the status of a print job.
         * @returns {Promise} - A Promise that will resolve to the status information.
         */
        getStatus: function () {
            var that = this;
            return Client.authorizedApiRequest('/print/jobs/' + this.id)
                .get()
                .then(function (data) {
                    that.status = data;
                    return data;
                })
                .catch(function (error) {
                    that.status = null;
                });
        },

        /**
         * Set a callback for a print job.
         * @param {String} callback_url
         * @returns {Promise}
         */
        setCallback: function (callback_url) {
            return Client.authorizedApiRequest('/print/jobs/' + this.id + '/register')
                .post({callback_url: callback_url})
        }
    };

})();
