         
var pm = new PerceptronMulticapas();
var analize = new ImageAnalize();

var inputs = [];

$(document).ready(function(){
    var total = 0;
    var count = 0;

    $('.scream').each(function(){
        total++;
    });

    $('.scream').one("load", function() {
        count++;
        if(count === total){
            inicialize();
        }
    }).each(function() {
        if(this.complete) {
            $(this).load();

        }
    });
});

function inicialize(){
    //cantidad de cuadros a analizar de las imagenes. Cuanto más cuadros más precisa es la detección
    var framesCount = 10;

    //inicializamos el objeto indicando la cantidad de cuadros a analizar
    analize.init(framesCount);

    //obtenemos las entradas de las imagenes para enviar al perceptron y que este aprenda de estos datos
    inputs = analize.get("myCanvas", "scream");

    var lienzo = new Lienzo();
    lienzo.init("perceptronPaint");

    document.getElementById("perceptronPaint").onmouseup = function (e){
        lienzo.generateThumbnail(function(){
            var input = analize.get("perceptronPaint", "", 0);

            $('#perceptron_status').html("Procesando ...");
            setTimeout(function(){
                predic(input);
            },100);
        });
    };
}

function predic(values){
    var tempNumber = 0;
    var tempMaxValue = 0;

    var tasa_aprendizaje = parseFloat($('#perceptron_tasa_aprendizaje').val());
    var error_deseado = parseFloat($('#perceptron_error_deseado').val());
    var epocas = parseInt($('#perceptron_epocas').val());            

    var out = [];
    var i = 0;
    for(var i=0; i < 6; i++){
        for(var n=0; n < inputs.length; n++){
            if(inputs[n].id !== i){
                inputs[n].out[0] = 0;
            }else{
                inputs[n].out[0] = 1;
            }
            if(inputs[n].main === 1 || (inputs[n].main === 0 && inputs[n].id === i)){
                out.push(inputs[n]);
            }
        }

        pm.init(inputs, tasa_aprendizaje, error_deseado, -0.25, 0.25, epocas);

        var val = pm.predic(values);
        $("#result_" + i).html(val);
        $("#acierto_" + i).html(parseInt(val*100) + " %");
    }
    for(var i=0; i < 9; i++){
        var v = parseFloat($("#result_" + i).html());
        $("#result_" + i).parents("tr").removeClass("table-success");
        if(v > tempMaxValue){
            tempMaxValue = v;
            tempNumber = i;
        }
    }
    $("#result_" + tempNumber).parents("tr").addClass("table-success");
    $('#perceptron_status').html("Proceso completado");
}