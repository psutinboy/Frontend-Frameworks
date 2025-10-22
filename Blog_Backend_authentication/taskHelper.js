const Task = require('./taskModel');

async function getAllTasks() {
    try {
        const tasks = await Task.find();  // Retrieves all tasks
        console.log(tasks);
        return tasks;
    } catch (err) {
        console.error(err);
    }
}

async function getTaskById(taskId) {
    try {
        const task = await Task.findById(taskId);  // Find task by ID
        console.log(task);
        return task;
    } catch (err) {
        console.error(err);
    }
}

async function updateTaskById(taskId, updatedFields) {
    try {
        const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            { $set: updatedFields },
            { new: true, runValidators: true }  // `new: true` returns the updated task, `runValidators` ensures the data is validated
        );
        console.log(updatedTask);
        return updatedTask;
    } catch (err) {
        console.error(err);
    }
}

async function deleteTaskById(taskId) {
    try {
        const deletedTask = await Task.findByIdAndDelete(taskId);  // Delete task by ID
        console.log(`Deleted Task: ${deletedTask}`);
        return deletedTask;
    } catch (err) {
        console.error(err);
    }
}