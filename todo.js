(function(){
        let tasks = [];
        const taskList = document.getElementById('list');
        const addTaskInput = document.getElementById('add');
        let tasksCounter = document.getElementById('tasks-counter');

        // console.log('Working');

        function addTaskToDOM(task){
            let li = document.createElement('li');
            li.innerHTML = `
            <input type="checkbox" id="${task.id}" ${task.completed ? 'checked' : '' } class="custom-checkbox">
            <label for="${task.id}">${task.title}</label>
            <img src="bin.svg" class="delete" data-id="${task.id}"/> 
            `; 
            taskList.append(li);
        }

        async function fetchTodos(){
            // fetch('https://jsonplaceholder.typicode.com/todos')
            // .then(function(response){
            //     // console.log(response);
            //     return response.json();
            // }).then((data)=>{
            //     // console.log(data);
            //     tasks = data.slice(0,20);
            //     renderList();
            // })
            // .catch(function(error){
            //     console.log('Error Occured',error);
            // })
            try {
                let response = await fetch('https://jsonplaceholder.typicode.com/todos');
                let data = await response.json();
                tasks = data.slice(0,10);
                renderList();
            } catch (error) {
                console.log(error);
            }
        }

        function renderList () {
            taskList.innerHTML = '';
            for(let i=0; i<tasks.length; i++){
                addTaskToDOM(tasks[i]);
            }
            tasksCounter.innerText = tasks.length;
        }

        function toggleTask(taskId) {
            for(let i=0; i<tasks.length; i++){
                if(taskId==tasks[i].id){
                    if(tasks[i].completed){
                        tasks[i].completed = false;
                    }else{
                        tasks[i].completed = true;
                    }
                    renderList();
                    showNotification('Task toggled successfully');
                    return;
                }
            }
            showNotification('Could not toggle the task');
        }

        function deleteTask (taskId) {
            let newTasks = [];
            for(let i=0; i<tasks.length ; i++){
                if(tasks[i].id != taskId){
                    newTasks.push(tasks[i]);
                }
            }
            tasks = newTasks;
            renderList();
            showNotification('Task deleted successfully');
            return;
        }

        function addTask (task) {
            


            if(task){
                fetch('https://jsonplaceholder.typicode.com/todos',
                {
                    method: 'POST', // or 'PUT'
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(task),
                    }
                )
                .then(function(response){
                    // console.log(response);
                    return response.json();
                }).then((data)=>{
                    console.log(data);
                    tasks.push(task);
                    renderList();
                    showNotification("Task added successfully ");
                    return;
                })
                .catch(function(error){
                    console.log('Error Occured',error);
                })
                // tasks.push(task);
                // renderList();
                // showNotification("Task added successfully ");
                
            }
            showNotification('Task can not be added');
        }

        function showNotification(text) {
            alert(text);
        }

        function handleInputKeyPress(event){
            if(event.key === 'Enter'){
                const text = event.target.value;
                // console.log(text);
                if(!text){
                    showNotification('Task text can not be empty');
                    return;
                }
                const task = {
                    title : text,
                    id: Date.now().toString(),
                    completed:false
                };
                
                event.target.value = "";
                addTask(task);
            }
        }

        function handleClickEvent(e){
            const target = e.target;
            // console.log(target);
            if(target.className === 'delete'){
                let taskId = target.dataset.id;
                deleteTask(taskId);
                return;
            }else if(target.className==='custom-checkbox'){
                let taskId = target.id;
                toggleTask(taskId);
                return;
            }
        }

        function initializer(){
            fetchTodos();
            addTaskInput.addEventListener('keyup',handleInputKeyPress);
            document.addEventListener('click',handleClickEvent);

        }
        initializer();
})();


