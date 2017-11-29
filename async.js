'use strict';

exports.isStar = true;
exports.runParallel = runParallel;

/** Функция паралелльно запускает указанное число промисов
 * @param {Array} jobs – функции, которые возвращают промисы
 * @param {Number} parallelNum - число одновременно исполняющихся промисов
 * @param {Number} timeout - таймаут работы промиса
 * @returns {Promise}
 */

function runParallel(jobs, parallelNum, timeout = 1000) {
    return new Promise(resolve => {
        if (!jobs.length || parallelNum <= 0) {
            Promise.resolve([]);
        }

        let counter = 0;
        let results = [];
        jobs
            .slice(0, parallelNum)
            .forEach(job => pushProcess(job, counter));

        function pushProcess(job, i) {
            counter++;
            Promise.race([
                job(),
                new Promise(reject => setTimeout(reject, timeout, new Error('Promise timeout')))])
                .then(result => pushResult(result, i))
                .catch(result => pushResult(result, i));
        }

        function pushResult(result, i) {
            results[i] = result;

            if (results.length === jobs.length) {
                resolve(results);
            }
            if (counter < jobs.length) {
                pushProcess(jobs[counter], counter);
            }
        }
    });
}
