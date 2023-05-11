<script>
    export let chatLayout;
    export let evtLayout;
    
   let positions = ['chat', 'evt'];
   
   let shiftTab = (direction) => {
    let movingTab = ''
    if (direction == 'left') {
        movingTab = positions[0];
        positions.shift();
        positions.push(movingTab);
    }
    else if (direction == 'right') {
        movingTab = positions[-1];
        positions.pop();
        positions.insert(0, movingTab)
    }
    console.log(positions)
   }
   
</script>

<div class="right-[20px] bottom-[90px] h-[200px] fixed">
    <h2 class="w-[90%] ml-auto mr-auto rounded-t-lg h-[5%] bg-accent text-center"><button on:click={shiftTab('left')} class="float-left rounded-md bg-primary w-[30%] h-fit p-2"></button> Settings <button on:click={shiftTab('right')} class="float-right rounded-md bg-primary w-[30%] h-fit p-2"></button></h2>
    <ul class="h-[90%] w-[95%] mt-5">
        <li>
            <label class="mt-1" for="chatW">Width: </label>
            <input
                bind:value={chatLayout.w}
                class="mt-1 text-center rounded-xl h-fit"
                name="chatW"
                type="number"
                min="3"
                max="13"
            />
        </li>
        <li>
            <label class="mt-1" for="chatH">Height: </label>
            <input
                bind:value={chatLayout.h}
                class="mt-1 text-center rounded-xl h-fit"
                name="chatH"
                type="number"
                min="2"
                max="6"
            />
        </li>
        <li>
            <label class="mt-1" for="chatX">X: </label>
            <input
                bind:value={chatLayout.x}
                class="mt-1 text-center rounded-xl h-fit"
                name="chatX"
                type="number"
                min="1"
                max="7"
            />
        </li>
        <li>
            <label class="mt-1" for="chatY">Y:</label>
            <input
                bind:value={chatLayout.y}
                class="mt-1 text-center rounded-xl h-fit"
                name="chatY"
                type="number"
                min="1"
                max="3"
            />
        </li>
    </ul>
</div>
