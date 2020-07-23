function queue(promise_list=[]) {
    let res = [];
    let sequence = Promise.resolve();
    promise_list.forEach(function (item) {
        sequence = sequence.then(item).then(data=>{
            res.push(data);
            return res
        })
    })
    return sequence
}
Promise.queue = queue