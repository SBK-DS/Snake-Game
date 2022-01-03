$(function(){
    var canvas = $('#canvas')[0];
    var ctx = canvas.getContext('2d')

    var snake = [
        {x: 50, y:100, oldX: 0, oldY: 0},
        {x: 50, y:90, oldX: 0, oldY: 0},
        {x: 50, y:80, oldX: 0, oldY: 0},
    ]

    var food = {x: 200, y:200, eaten: false}
    var score = 0

    var snakeWidth = snakeHeight = 10;
    var blockSize = 10

    const LEFT = 37;
    const UP = 38;
    const RIGHT = 39;
    const DOWN = 40;

    var keyPressed = DOWN;
    var game;

    // Adding movement in snake
    game = setInterval(gameLoop, 100)
    function gameLoop() {
        clearCanvas() // Clear the canvas
        drawFood() // Draw the food to eat
        moveSnake() // Move snake
        drawSnake()  // Then draw the snake after its positions are changed
    }


    function moveSnake(){
        $.each(snake, function(index, value){
            snake[index].oldX = value.x
            snake[index].oldY = value.y

            if(index == 0) // Checking if its head of snake
            {

                if(collided(value.x, value.y))
                {
                    console.log('yes collided')
                    gameOver();
                }

                if(keyPressed == DOWN)
                {
                    snake[index].y = value.y + blockSize;
                }
                else if(keyPressed == UP)
                {
                    snake[index].y = value.y - blockSize;
                }
                else if(keyPressed == RIGHT)
                {
                    snake[index].x = value.x + blockSize;
                }
                else if(keyPressed == LEFT)
                {
                    snake[index].x = value.x - blockSize;
                }
            }
            else
            {
                snake[index].x = snake[index-1].oldX
                snake[index].y = snake[index-1].oldY
            }
        })
    }

    function collided(x, y)
    {
        return snake.filter(function(value, index) {
            return index != 0 && value.x == x && value.y == y;
        }).length > 0 || x == 0 || x == canvas.width || y == 0 || y == canvas.height;

        // Above we first put conditions for hitting own self, then hitting the boundaries
    }


    function drawSnake() // draw snake
    {
        $.each(snake, function(index, value){
            ctx.fillStyle = 'red'
            ctx.fillRect(value.x, value.y, snakeWidth, snakeHeight)
            ctx.strokeStyle = 'white'
            ctx.strokeRect(value.x, value.y, snakeWidth, snakeHeight);

            // Checking if snake eats the food 

            if(index == 0)
            {
                if(didEatFood(value.x, value.y))
                {
                    score++;
                    $('#score').text(score)
                    console.log('Yummy!!!', score)
                    food.eaten = true
                    makeSnakeBigger();
                }
            }
        })
    }

    function makeSnakeBigger()
    {
        snake.push({
            x: snake[snake.length-1].oldX,
            y: snake[snake.length-1].oldY,
        })
    }

    function drawFood() // drawing food
    {
        ctx.fillStyle = 'yellow';
        if(food.eaten == true)
        {
            food = getNewPositionForFood()
        }
        ctx.fillRect(food.x, food.y, snakeWidth, snakeHeight)
    }
    function didEatFood(x, y)
    {
        return food.x == x && food.y == y;
    }

    function clearCanvas() // clearing canvas
    {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
    }

    $(document).keydown(function(e){
        if($.inArray(e.which, [DOWN, UP, LEFT, RIGHT]) != -1) // checking only arrow keys are pressed
        {
            keyPressed = checkKeyIsAllowed(e.which)
            console.log(keyPressed)
        }
    })

    function checkKeyIsAllowed(val)
    {
        let key;
        if(val == DOWN)
        {
            key = (keyPressed != UP) ? val : keyPressed
        }
        else if(val == UP)
        {
            key = (keyPressed != DOWN) ? val : keyPressed
        }
        else if(val == RIGHT)
        {
            key = (keyPressed != LEFT) ? val : keyPressed
        }
        else if(val == LEFT)
        {
            key = (keyPressed != RIGHT) ? val : keyPressed
        }

        return key;
    }

    function gameOver()
    {
        alert('Game Over')
        clearInterval(game)
    }

    function getNewPositionForFood()
    {
        let xArr = yArr = [], xy;
        $.each(snake, function(index, value){
            if($.inArray(value.x, xArr) != -1)
            {
                xArr.push(value.x)
            }
            if($.inArray(value.y, yArr) == -1)
            {
                yArr.push(value.y)
            }
        })
        xy = getEmptyXY(xArr, yArr)
        return xy;
    }

    function getEmptyXY(X, Y)
    {
        let newX, newY
        newX = getRandomNumber(canvas.width - blockSize, blockSize)
        newY = getRandomNumber(canvas.height - blockSize, blockSize)
        if($.inArray(newX, X) == -1 && $.inArray(newY, Y) != -1)
        {
            return {
                x: newX,
                y: newY,
                eaten: false
            }
        }
        else
        {
            return getEmptyXY(X, Y);
        }
    }

    function getRandomNumber(max, multipleOf)
    {
        let result = Math.floor(Math.random() * max);
        result = (result % 10 == 0) ? result : result + (multipleOf - result % 10)
        return result
    }
})
