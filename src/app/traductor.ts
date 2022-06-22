import { ErrorNode } from "antlr4ts/tree/ErrorNode";
import { TerminalNode } from "antlr4ts/tree/TerminalNode";
import * as process from "process";
//import { SLListener } from "SLListener";
//import { AsignacionContext, Ciclo_desdeContext, Ciclo_desde_finContext, Ciclo_desde_inicioContext, Ciclo_mientrasContext, Ciclo_mientras_condicionContext, Ciclo_repetirContext, Ciclo_repetir_condicionContext, CodigoContext, CondicionalContext, Condicional_condicionContext, Declaracion_contenido_constContext, Declaracion_contenido_tiposContext, Declaracion_contenido_varContext, ExpresionContext, Id_arreglo_registroContext, Llamada_subrutinaContext, Main_subrutinaContext, Mas_casos_evalContext, Mas_declaraciones_constContext, Mas_parametrosContext, Otros_idContext, ParametrosContext, Param_subrutinaContext, Paso_optContext, Punto_y_coma_opcional_subrutinaContext, SentenciaContext, Sentencia_evalContext, Sentencia_eval_casoContext, Sentencia_internaContext, Sentencia_retorna_mainContext, Sentencia_retorna_subrutinaContext, SLParser, Subrutina_Context } from "SLParser";
/*import grammar.SLParser;
import org.antlr.v4.runtime.tree.ErrorNode;
import org.antlr.v4.runtime.tree.TerminalNode;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;*/

/*export class SL2Python {

    inFor: boolean = false;
    inAsignacion: boolean = false;
    inMasParametros: boolean = false;
    inExpresion: boolean = false;
    inLeer: boolean = false;
    inParametros: boolean = false;
    inConstDeclaracion: boolean = false;
    inDeclaracion: boolean = false;
    inIDArregloRegistro: boolean = false;
    cicloDesdeHaciaAdelante: boolean = true;
    funcionPredefinida: boolean = false;
    error: boolean = false;
    inSentencia_retorna_subrutina: boolean = false;
    numTabs: number = 0;
    sameTerminals: string[] = ["(", ")", "[", "]"];
    mainArray: string[] = [];
    subrutinasArray: string[] = [];
    intoMainArray: boolean = true;

    constructor() {
    }

    enterCodigo(ctx: CodigoContext) {
        console.log("import math\n");
        console.log("import random\n");
        console.log("import psutil\n");
        console.log("import datetime\n");
        console.log("import sys\n");
    }

   exitCodigo(ctx: CodigoContext) {
        let textoSubrutinas = ""
        let main = ""
        for (let i = 0; i < this.subrutinasArray.length; i++) {
            textoSubrutinas = textoSubrutinas + this.subrutinasArray[i]
            //process.stdout.write("" + this.subrutinasArray[i] + "\r")
            //console.log(this.subrutinasArray[i])
        }
        console.log(textoSubrutinas)
        for (let i = 0; i < this.mainArray.length; i++) {
            main = main + this.mainArray[i]
            //process.stdout.write("" + this.mainArray[i] + "\r")
            //console.log(this.mainArray[i])
        }
        console.log(main)
    }

    enterCondicional(ctx: CondicionalContext){
        this.addToArray("if(");
    }

    exitCondicional(ctx: CondicionalContext){
        this.numTabs-=1;

    }

    exitCondicional_condicion(ctx: Condicional_condicionContext) {
        this.addToArray("):\n");
        this.numTabs+=1;
    }

    enterCiclo_mientras(ctx: Ciclo_mientrasContext){
        this.addToArray("while(");
    }

    exitCiclo_mientras(ctx: Ciclo_mientrasContext) {
        this.numTabs-=1;
    }

    exitCiclo_mientras_condicion(ctx: Ciclo_mientras_condicionContext){
        this.addToArray("):\n");
        this.numTabs+=1;
    }

    enterSentencia_eval_caso(ctx: Sentencia_eval_casoContext) {
        this.addToArray("if(");
    }

    exitSentencia_eval_caso(ctx: Sentencia_eval_casoContext) {
        this.addToArray("):\n");
        this.numTabs+=1;
    }

    enterMas_casos_eval(ctx: Mas_casos_evalContext) {
        this.numTabs-=1;
        if(ctx.sentencia_eval_caso() != null) {
            this.addToArray("el");
        } else if (ctx.SINO() != null) {
            this.addToArray("else:\n");
            this.numTabs+=1;
        }

    }
    exitSentencia_eval(ctx: Sentencia_evalContext){
        this.numTabs-=1;
    }

    enterCiclo_desde(ctx: Ciclo_desdeContext){
        if(ctx.paso_opt().expresion() != null){
            let paso = Number(ctx.paso_opt().expresion());
            if(paso>=0){
                this.cicloDesdeHaciaAdelante = true;
            }else{
                this.cicloDesdeHaciaAdelante = false;
            }
        }
        this.addToArray("for ");
        this.inFor = true;
    }

    exitCiclo_desde(ctx: Ciclo_desdeContext){
        this.numTabs-=1;
    }

    enterCiclo_desde_inicio(ctx: Ciclo_desde_inicioContext) {
        this.addToArray(String(ctx.ID()));
        this.addToArray(" in range(");
    }

    
    exitCiclo_desde_inicio(ctx: Ciclo_desde_inicioContext) {
        this.addToArray(",");
    }
    
    exitCiclo_desde_fin(ctx: Ciclo_desde_finContext) {
        if(this.cicloDesdeHaciaAdelante){
            this.addToArray("+1");
        }else{
            this.addToArray("-1");
        }
    }

    
    enterPaso_opt(ctx: Paso_optContext) {
        if(ctx.PASO() != null){
            this.addToArray(",");
        }
    }

    
    exitPaso_opt(ctx: Paso_optContext) {
        this.addToArray("):\n");
        this.numTabs+=1;
    }

    
    enterCiclo_repetir(ctx: Ciclo_repetirContext) {
        this.addToArray("while True:\n");
        this.numTabs+=1;
    }

    
    exitCiclo_repetir(ctx: Ciclo_repetirContext) {
        this.numTabs-=1;
    }

    
    enterCiclo_repetir_condicion(ctx: Ciclo_repetir_condicionContext) {
        this.addToArray("\tif(");
    }

    
    exitCiclo_repetir_condicion(ctx: Ciclo_repetir_condicionContext) {
        this.addToArray("): break\n");

    }

    
    enterExpresion(ctx: ExpresionContext){
        this.inExpresion = true;
        let funciones_predefinidas = ["abs", "arctan", "ascii", "cos", "dec", "eof", "exp", "get_ifs", "inc", "int", "log", "lower", "mem", "ord", "paramval",
                "pcount", "pos", "random", "sec", "set_stdin", "set_stdout", "sin", "sqrt", "str", "strdup", "strlen", "substr", "tan", "upper", "val"];
        let funciones_predefinidas_list = funciones_predefinidas;

        if(ctx.ID()!=null && funciones_predefinidas_list.includes(String(ctx.ID()))){
            this.funcionPredefinida = true;
            this.traduceFuncionPredefinidaExpresion(ctx);
        }
    }

    
    exitExpresion(ctx: ExpresionContext){
        this.inExpresion = false;
    }

    
    enterSentencia_interna(ctx: Sentencia_internaContext){
        //String temp = String.join("", Collections.nCopies(numTabs, "\t"));
        var temp = ""
        for (let index = 0; index < this.numTabs; index++) {
            temp = temp + "\t"
        }
        this.addToArray(temp);
    }
    
    enterSentencia_retorna_subrutina(ctx: Sentencia_retorna_subrutinaContext){
        this.inSentencia_retorna_subrutina = true;
    }
    
    exitSentencia_retorna_subrutina(ctx: Sentencia_retorna_subrutinaContext){
        this.inSentencia_retorna_subrutina = false;
    }

    
    exitSentencia_retorna_main(ctx: Sentencia_retorna_mainContext) {
        this.addToArray("\n");
    }

    
    exitSentencia_interna(ctx: Sentencia_internaContext){
        this.addToArray("\n");
    }
    
    exitSentencia(ctx: SentenciaContext){
        // if (!error){
        // }
        this.addToArray("\n");
    }

    
    enterAsignacion(ctx: AsignacionContext) {
        // if (!error){

        // }
        this.inAsignacion = true;
        this.addToArray(String(ctx.parent.parent.getChild(0)));
    }

    
    enterId_arreglo_registro(ctx: Id_arreglo_registroContext) {
        this.inIDArregloRegistro = true;
    }
    
    exitId_arreglo_registro(ctx: Id_arreglo_registroContext) {
        this.inIDArregloRegistro = false;
    }

    
    enterSentencia(ctx: SentenciaContext){
        // if (!error){

        // }
       let funciones_predefinidas = ["abs", "arctan", "ascii", "cos", "dec", "eof", "exp", "get_ifs", "inc", "int", "log", "lower", "mem", "ord", "paramval",
                "pcount", "pos", "random", "sec", "set_stdin", "set_stdout", "sin", "sqrt", "str", "strdup", "strlen", "substr", "tan", "upper", "val"];
        let funciones_predefinidas_list = funciones_predefinidas;

        if (ctx.ID() != null && ctx.id_casos().llamada_subrutina() != null && !funciones_predefinidas_list.includes(String(ctx.ID()))){
            if (String(ctx.ID()) !== "imprimir" && String(ctx.ID()) !== "leer"){
                this.addToArray(String(ctx.ID()));
            }
        }
        if(ctx.ID()!=null && funciones_predefinidas_list.includes(String(ctx.ID()))){
            this.funcionPredefinida = true;
            this.traduceFuncionPredefinidaSentencia(ctx);
        }
        var temp = ""
        for (let index = 0; index < this.numTabs; index++) {
            temp = temp + "\t"
            
        }
        this.addToArray(temp);
        this.addToArray(temp);
    }
    
    exitAsignacion(ctx: AsignacionContext) {
        this.inAsignacion = false;

    }

    
    enterMas_parametros(ctx: Mas_parametrosContext) {
        this.inMasParametros = true;
    }
    
    exitMas_parametros(ctx: Mas_parametrosContext) {
        this.inMasParametros = false;
    }

    
    exitLlamada_subrutina(ctx: Llamada_subrutinaContext) {
        if(this.inLeer){
            this.inLeer = false;
        }
    }

    
    enterParametros(ctx: ParametrosContext) {
        this.inParametros = true;
    }
    
    exitParametros(ctx: ParametrosContext) {
        this.inParametros = true;
    }

    
    enterDeclaracion_contenido_const(ctx: Declaracion_contenido_constContext) {
        this.inConstDeclaracion = true;
    }

    
    enterMas_declaraciones_const(ctx: Mas_declaraciones_constContext) {
        // if (!error){

        // }
        this.addToArray("\n");
        this.inConstDeclaracion = false;
    }

    
    enterDeclaracion_contenido_tipos(ctx: Declaracion_contenido_tiposContext) {
        this.inDeclaracion = true;
    }

    
    exitDeclaracion_contenido_tipos(ctx: Declaracion_contenido_tiposContext) {
        this.inDeclaracion = false;
    }

    
    enterDeclaracion_contenido_var(ctx: Declaracion_contenido_varContext) {
        this.inDeclaracion = true;
    }

    
    exitDeclaracion_contenido_var(ctx: Declaracion_contenido_varContext) {
        this.inDeclaracion = false;
    }

    
    enterSubrutina_(ctx: Subrutina_Context) {
        this.intoMainArray = false;
        try {
            this.addToArray(":\n");
            this.numTabs+=1;
        } catch (error) {
        }
        // if (!error){
        //     if (ctx.ID() != null) {
        //         this.addToArray("def " + ctx.ID().getText());
        //     }
        // }
    }

    
    exitSubrutina_(ctx: Subrutina_Context) {
        this.intoMainArray = true;
    }

    
    enterMain_subrutina(ctx: Main_subrutinaContext) {
        // if (!error){
        //     this.addToArray(":\n");
        //     this.numTabs+=1;
        // }
        try {
            this.addToArray(":\n");
            this.numTabs+=1;
        } catch (error) {
        }
    }

    
    exitMain_subrutina(ctx: Main_subrutinaContext) {
        // if (!error){
        //     this.addToArray("\n");
        //     this.numTabs-=1;
        // }
        try {
            this.addToArray("\n");
            this.numTabs-=1
        } catch (error) {
            
        }
    }

    
    enterParam_subrutina(ctx: Param_subrutinaContext) {
        // if (!error){
        //     if (ctx.ID() != null){
        //         this.addToArray(ctx.ID().getText());
        //     }
        // }
        try {
            if (ctx.ID() != null){
                this.addToArray(String(ctx.ID()));
            }
        } catch (error) {

        }
    }


    enterOtros_id(ctx: Otros_idContext) {
        // if (!error && !inDeclaracion){
        //     if (ctx.ID() != null){
        //         this.addToArray(", " + ctx.ID().getText());
        //     }
        // }
        try {
            if (!this.inDeclaracion){
                if (ctx.ID() != null){
                    this.addToArray(", " + String(ctx.ID()));
                }
            }
        } catch (error) {
        }
    }

    
    enterPunto_y_coma_opcional_subrutina(ctx: Punto_y_coma_opcional_subrutinaContext) {
        // if (!error){
        //     if (ctx.ID() != null){
        //         this.addToArray(", " + ctx.ID().getText());
        //     }
        // }
        try {
            if (ctx.ID() != null){
                this.addToArray(", " + String(ctx.ID()));
            }
        } catch (error) {
            
        }
    }

    
    visitTerminal(node: TerminalNode) {
        try {
            if (this.inDeclaracion || this.inSentencia_retorna_subrutina){
                // SKIP :)
            }else if (String(node) === "leer") {
                this.inLeer = true;
            } else if (this.inLeer) {
                if(this.inParametros && this.inExpresion){
                    this.addToArray(node.parent + " = input()\n");
                    this.inParametros = false;
                } else if (this.inMasParametros) {
                    this.inParametros = true;
                }
            } else if (String(node) ===  "imprimir") {
                this.addToArray("print");
            } else if (this.sameTerminals.includes(String(node))) {
                if(this.funcionPredefinida){
                    if(String(node) === ")" ){
                        this.funcionPredefinida = false;
                    }
                }else{
                   this.addToArray(String(node));
                }
            } else if(String(node) === "^") {
                this.addToArray("**");
            } else if (String(node) === "<>") {
                this.addToArray("!=");
            } else if (this.inMasParametros && String(node) === ",") {
                if(this.funcionPredefinida){
                    //print nothing
                }else{
                    this.addToArray(",");
                }
            } else if (this.inExpresion && String(node) === "{") {
                this.addToArray("[");
            } else if (this.inExpresion && String(node) === "}") {
                this.addToArray("]");
            } else if(String(node)==="and" || String(node) === "or" || String(node) === "not") {
                this.addToArray(" " + String(node) + " ");
            } else if (String(node)==="retorna"){
                this.addToArray("\treturn ");
            } else if ((this.inExpresion || this.inAsignacion || this.inConstDeclaracion)) {
                if (!this.funcionPredefinida){
                    if(this.inIDArregloRegistro){
                        this.addToArray(String(node) + "-1");
                    }else{
                        this.addToArray(String(node));
                    }
                }
            } else {
            }
        } catch (error) {
        }
    }

    
    visitErrorNode(node: ErrorNode) {
        this.error = true;
    }
    traduceFuncionPredefinidaExpresion(ctx: ExpresionContext){
        let translatedFunction= "";
        let  funcion = String(ctx.ID());
        let parentesisYParametros = String(ctx.valor_aux());
        switch (funcion){
            case "abs":
                translatedFunction = "abs"+ parentesisYParametros;
                break;
            case "arctan":
                translatedFunction = "math.atan"+ parentesisYParametros;
                break;
            case "ascii":
                translatedFunction = "ascii"+ parentesisYParametros;
                break;
            case "cos":
                translatedFunction = "math.cos"+ parentesisYParametros;
                break;
            case "dec":
                let decN = String(ctx.valor_aux().llamada_subrutina().parametros().expresion());
                let decA = "1";
                if(ctx.valor_aux().llamada_subrutina().parametros().mas_parametros().expresion() != null){
                    decA = String(ctx.valor_aux().llamada_subrutina().parametros().mas_parametros().expresion());
                }
                translatedFunction = "("+decN + "-" + decA+")";
                break;
            case "eof": //https://www.cnc.una.py/sl/SL-stdf.html#eof
                //PENDIENTE
                break;
            case "exp":
                translatedFunction = "math.exp"+ parentesisYParametros;
                break;
            case "get_ifs": //https://www.cnc.una.py/sl/SL-stdf.html#get_ifs
                //PENDIENTE
                break;
            case "inc": //https://www.cnc.una.py/sl/SL-stdf.html#inc
                let incN = String(ctx.valor_aux().llamada_subrutina().parametros().expresion());
                let incA = "1";
                if(ctx.valor_aux().llamada_subrutina().parametros().mas_parametros().expresion() != null){
                    incA = String(ctx.valor_aux().llamada_subrutina().parametros().mas_parametros().expresion());
                }
                translatedFunction = "("+incN + "+" + incA+")";
                break;
            case "int":
                translatedFunction = "int"+ parentesisYParametros;
                break;
            case "log":
                translatedFunction = "math.log"+ parentesisYParametros;
                break;
            case "lower": // https://www.cnc.una.py/sl/SL-stdf.html#lower
                translatedFunction = ctx.valor_aux().llamada_subrutina().parametros() + ".lower()";
                break;
            case "mem":
                translatedFunction = "psutil.virtual_memory().total";
                break;
            case "ord":
                translatedFunction = "ord"+ parentesisYParametros;
                break;
            case "paramval": //https://www.cnc.una.py/sl/SL-stdf.html#paramval
                //PENDIENTE
                break;
            case "pcount": //https://www.cnc.una.py/sl/SL-stdf.html#pcount
                //PENDIENTE
                break;
            case "pos": //https://www.cnc.una.py/sl/SL-stdf.html#pcount
                if(ctx.valor_aux().llamada_subrutina().parametros().mas_parametros().mas_parametros().expresion() != null){
                    translatedFunction = String(ctx.valor_aux().llamada_subrutina().parametros().expresion().variable()) + ".pos("+ ctx.valor_aux().llamada_subrutina().parametros().mas_parametros().expresion().variable() +", " + ctx.valor_aux().llamada_subrutina().parametros().mas_parametros().mas_parametros().expresion().variable() + ")";
                }else{
                    translatedFunction = String(ctx.valor_aux().llamada_subrutina().parametros().expresion().variable()) + ".pos("+ ctx.valor_aux().llamada_subrutina().parametros().mas_parametros().expresion().variable() + ")";
                }
                break;
            case "random":
                if(ctx.valor_aux().llamada_subrutina().parametros().mas_parametros().expresion() != null){
                    translatedFunction= "random.seed(" + ctx.valor_aux().llamada_subrutina().parametros().mas_parametros().expresion().variable() + ")\nrandom.randrange(0,"+ ctx.valor_aux().llamada_subrutina().parametros().expresion().variable() +" )";
                }else{
                    translatedFunction = "random.randrange(0,"+ ctx.valor_aux().llamada_subrutina().parametros().expresion().variable() +")";
                }
                break;
            case "sec":
                translatedFunction = "(datetime.datetime.utcnow() - datetime.datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)).seconds";
                break;
            case "set_stdin":
                translatedFunction = "try:\n" +
                        "\tfile_opened = open("+ ctx.valor_aux().llamada_subrutina().parametros().expresion().variable() +",\"r\").readlines()\n" +
                        "except FileNotFoundError:\n" +
                        "\tprint(False)";
                break;
            case "set_stdout":
                let ruta = String(ctx.valor_aux().llamada_subrutina().parametros().expresion().variable());
                let modo = "w";
                if(ctx.valor_aux().llamada_subrutina().parametros().mas_parametros().expresion() != null){
                    switch(String(ctx.valor_aux().llamada_subrutina().parametros().mas_parametros().expresion().variable())){
                        case "\"at\"":
                            modo = "\"a\"";
                            break;
                        default:
                            modo = "\"w\"";
                            break;
                    } ;

                }
                translatedFunction =
                        "try:\n" +
                                "\topen("+ ruta +",\"r\")\n" +
                                "\tsys.stdout = open("+ ruta +","+ modo +")\n" +
                                "except FileNotFoundError:\n" +
                                "\tprint(False)\n" +
                                "\tsys.stdout = sys.__stdout__";
                break;
            case "sin":
                translatedFunction = "math.sin"+ parentesisYParametros;
                break;
            case "sqrt":
                translatedFunction = "math.sqrt"+ parentesisYParametros;
                break;
            // case "str":
            //     let n = String(ctx.valor_aux().llamada_subrutina().parametros().expresion());
            //     let a = "0";
            //     let cant_dec = "2";
            //     let r = " ";
            //     if(ctx.valor_aux().llamada_subrutina().parametros().mas_parametros().expresion() != null){
            //         a = String(ctx.valor_aux().llamada_subrutina().parametros().mas_parametros().expresion().variable());
            //         if(ctx.valor_aux().llamada_subrutina().parametros().mas_parametros().mas_parametros().expresion() != null){
            //             cant_dec = String(ctx.valor_aux().llamada_subrutina().parametros().mas_parametros().mas_parametros().expresion().variable());
            //             if(ctx.valor_aux().llamada_subrutina().parametros().mas_parametros().mas_parametros().mas_parametros().expresion() != null){
            //                 r = String(ctx.valor_aux().llamada_subrutina().parametros().mas_parametros().mas_parametros().mas_parametros().expresion().variable());
            //                 r = r.replace("\"","");
            //                 r = r.replace("'","");
            //             }
            //         }
            //     }
            //     let relleno = String.join("", Collections.nCopies(Integer.parseInt(a), r));
            //     //String relleno =  r.repeat(Integer.parseInt(a));
            //     String numeroBase =  "str(round("+n+","+cant_dec+"))";
            //     if (cant_dec.equals("0")){
            //         numeroBase = "str(round("+n+"))";
            //     }
            //     translatedFunction = "(\""+relleno +"\""+ "+" +numeroBase+")[-"+a+":]";
            //     break;
            // case "strdup":
            //     String cadena = ctx.valor_aux().llamada_subrutina().parametros().expresion().getText();
            //     String numeroVeces = ctx.valor_aux().llamada_subrutina().parametros().mas_parametros().expresion().getText();
            //     translatedFunction = cadena + "*" + numeroVeces;
            //     break;
            // case "strlen":
            //     translatedFunction = "len"+ parentesisYParametros;
            //     break;
            // case "substr":
            //     String cadenaSubstr = ctx.valor_aux().llamada_subrutina().parametros().expresion().getText();
            //     String inicio = ctx.valor_aux().llamada_subrutina().parametros().mas_parametros().expresion().getText();
            //     String cant = "";
            //     if (ctx.valor_aux().llamada_subrutina().parametros().mas_parametros().mas_parametros().expresion() != null){
            //         cant = ctx.valor_aux().llamada_subrutina().parametros().mas_parametros().mas_parametros().expresion().getText();
            //         translatedFunction = cadenaSubstr+"["+inicio+"-1: "+inicio+"-1+" + cant +"]";
            //     }else{
            //         translatedFunction = cadenaSubstr+"["+inicio+"-1:]";
            //     }
            //     break;
            // case "tan":
            //     translatedFunction = "math.tan"+ parentesisYParametros;
            //     break;
            // case "upper":
            //     translatedFunction = ctx.valor_aux().llamada_subrutina().parametros().getText() + ".upper()";
            //     break;
            // case "val":
            //     translatedFunction ="try:\n" +
            //             "\tfloat(" +ctx.valor_aux().llamada_subrutina().parametros().expresion().getText()+")\n" +
            //             "except ValueError:\n" +
            //             "\t0";
            //     break;
        }
        this.addToArray(translatedFunction);
    }

    traduceFuncionPredefinidaSentencia(ctx: SentenciaContext){
        let translatedFunction = "";
        let funcion = String(ctx.ID());
        let parentesisYParametros = String(ctx.id_casos());
        switch (funcion){
            case "abs":
                translatedFunction = "abs"+ parentesisYParametros;
                break;
            case "arctan":
                translatedFunction = "math.atan"+ parentesisYParametros;
                break;
            case "ascii":
                translatedFunction = "ascii"+ parentesisYParametros;
                break;
            case "cos":
                translatedFunction = "math.cos"+ parentesisYParametros;
                break;
            case "dec":
                let decN = String(ctx.id_casos().llamada_subrutina().parametros().expresion());
                let decA = "1";
                if(ctx.id_casos().llamada_subrutina().parametros().mas_parametros().expresion() != null){
                    decA = String(ctx.id_casos().llamada_subrutina().parametros().mas_parametros().expresion());
                }
                translatedFunction = "("+decN + "-" + decA+")";
                break;
            case "eof": //https://www.cnc.una.py/sl/SL-stdf.html#eof
                //PENDIENTE
                break;
            case "exp":
                translatedFunction = "math.exp"+ parentesisYParametros;
                break;
            case "get_ifs": //https://www.cnc.una.py/sl/SL-stdf.html#get_ifs
                //PENDIENTE
                break;
            case "inc": //https://www.cnc.una.py/sl/SL-stdf.html#inc
                let incN = String(ctx.id_casos().llamada_subrutina().parametros().expresion());
                let incA = "1";
                if(ctx.id_casos().llamada_subrutina().parametros().mas_parametros().expresion() != null){
                    incA = String(ctx.id_casos().llamada_subrutina().parametros().mas_parametros().expresion());
                }
                translatedFunction = "("+incN + "+" + incA+")";
                break;
            case "int":
                translatedFunction = "int"+ parentesisYParametros;
                break;
            case "log":
                translatedFunction = "math.log"+ parentesisYParametros;
                break;
            case "lower": // https://www.cnc.una.py/sl/SL-stdf.html#lower
                translatedFunction = ctx.id_casos().llamada_subrutina().parametros() + ".lower()";
                break;
            case "mem":
                translatedFunction = "psutil.virtual_memory().total";
                break;
            case "ord":
                translatedFunction = "ord"+ parentesisYParametros;
                break;
            case "paramval": //https://www.cnc.una.py/sl/SL-stdf.html#paramval
                //PENDIENTE
                break;
            case "pcount": //https://www.cnc.una.py/sl/SL-stdf.html#pcount
                //PENDIENTE
                break;
            case "pos": //https://www.cnc.una.py/sl/SL-stdf.html#pcount
                if(ctx.id_casos().llamada_subrutina().parametros().mas_parametros().mas_parametros().expresion() != null){
                    translatedFunction = ctx.id_casos().llamada_subrutina().parametros().expresion().variable() + ".pos("+ ctx.id_casos().llamada_subrutina().parametros().mas_parametros().expresion().variable() +", " + ctx.id_casos().llamada_subrutina().parametros().mas_parametros().mas_parametros().expresion().variable() + ")";
                }else{
                    translatedFunction = ctx.id_casos().llamada_subrutina().parametros().expresion().variable() + ".pos("+ ctx.id_casos().llamada_subrutina().parametros().mas_parametros().expresion().variable() + ")";
                }
                break;
            case "random":
                if(ctx.id_casos().llamada_subrutina().parametros().mas_parametros().expresion() != null){
                    translatedFunction= "random.seed(" + ctx.id_casos().llamada_subrutina().parametros().mas_parametros().expresion().variable() + ")\nrandom.randrange(0,"+ ctx.id_casos().llamada_subrutina().parametros().expresion().variable() +" )";
                }else{
                    translatedFunction = "random.randrange(0,"+ ctx.id_casos().llamada_subrutina().parametros().expresion().variable() +")";
                }
                break;
            case "sec":
                translatedFunction = "(datetime.datetime.utcnow() - datetime.datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)).seconds";
                break;
            case "set_stdin":
                translatedFunction = "try:\n" +
                        "\tfile_opened = open("+ ctx.id_casos().llamada_subrutina().parametros().expresion().variable() +",\"r\").readlines()\n" +
                        "except FileNotFoundError:\n" +
                        "\tprint(False)";
                break;
            case "set_stdout":
                let  ruta = String(ctx.id_casos().llamada_subrutina().parametros().expresion().variable());
                let modo = "w";
                if(ctx.id_casos().llamada_subrutina().parametros().mas_parametros().expresion() != null){
                    switch(String(ctx.id_casos().llamada_subrutina().parametros().mas_parametros().expresion().variable())){
                        case "\"at\"":
                            modo = "\"a\"";
                            break;
                        default:
                            modo = "\"w\"";
                            break;
                    } ;

                }
                translatedFunction =
                        "try:\n" +
                                "\topen("+ ruta +",\"r\")\n" +
                                "\tsys.stdout = open("+ ruta +","+ modo +")\n" +
                                "except FileNotFoundError:\n" +
                                "\tprint(False)\n" +
                                "\tsys.stdout = sys.__stdout__";
                break;
            case "sin":
                translatedFunction = "math.sin"+ parentesisYParametros;
                break;
            case "sqrt":
                translatedFunction = "math.sqrt"+ parentesisYParametros;
                break;
            // case "str":
            //     String n = ctx.id_casos().llamada_subrutina().parametros().expresion().getText();
            //     String a = "0";
            //     String cant_dec = "2";
            //     String r = " ";
            //     if(ctx.id_casos().llamada_subrutina().parametros().mas_parametros().expresion() != null){
            //         a = ctx.id_casos().llamada_subrutina().parametros().mas_parametros().expresion().variable().getText();
            //         if(ctx.id_casos().llamada_subrutina().parametros().mas_parametros().mas_parametros().expresion() != null){
            //             cant_dec = ctx.id_casos().llamada_subrutina().parametros().mas_parametros().mas_parametros().expresion().variable().getText();
            //             if(ctx.id_casos().llamada_subrutina().parametros().mas_parametros().mas_parametros().mas_parametros().expresion() != null){
            //                 r = ctx.id_casos().llamada_subrutina().parametros().mas_parametros().mas_parametros().mas_parametros().expresion().variable().getText();
            //                 r = r.replace("\"","");
            //                 r = r.replace("'","");
            //             }
            //         }
            //     }
            //     String relleno = String.join("", Collections.nCopies(Integer.parseInt(a), r));
            //     //String relleno =  r.repeat(Integer.parseInt(a));
            //     String numeroBase =  "str(round("+n+","+cant_dec+"))";
            //     if (cant_dec.equals("0")){
            //         numeroBase = "str(round("+n+"))";
            //     }
            //     translatedFunction = "(\""+relleno +"\""+ "+" +numeroBase+")[-"+a+":]";
            //     break;
            // case "strdup":
            //     String cadena = ctx.id_casos().llamada_subrutina().parametros().expresion().getText();
            //     String numeroVeces = ctx.id_casos().llamada_subrutina().parametros().mas_parametros().expresion().getText();
            //     translatedFunction = cadena + "*" + numeroVeces;
            //     break;
            // case "strlen":
            //     translatedFunction = "len"+ parentesisYParametros;
            //     break;
            // case "substr":
            //     String cadenaSubstr = ctx.id_casos().llamada_subrutina().parametros().expresion().getText();
            //     String inicio = ctx.id_casos().llamada_subrutina().parametros().mas_parametros().expresion().getText();
            //     String cant = "";
            //     if (ctx.id_casos().llamada_subrutina().parametros().mas_parametros().mas_parametros().expresion() != null){
            //         cant = ctx.id_casos().llamada_subrutina().parametros().mas_parametros().mas_parametros().expresion().getText();
            //         translatedFunction = cadenaSubstr+"["+inicio+"-1: "+inicio+"-1+" + cant +"]";
            //     }else{
            //         translatedFunction = cadenaSubstr+"["+inicio+"-1:]";
            //     }
            //     break;
            // case "tan":
            //     translatedFunction = "math.tan"+ parentesisYParametros;
            //     break;
            // case "upper":
            //     translatedFunction = ctx.id_casos().llamada_subrutina().parametros().getText() + ".upper()";
            //     break;
            // case "val":
            //     translatedFunction ="try:\n" +
            //             "\tfloat(" +ctx.id_casos().llamada_subrutina().parametros().expresion().getText()+")\n" +
            //             "except ValueError:\n" +
            //             "\t0";
            //     break;
        }
        this.addToArray(translatedFunction);
    }

     addToArray(cadena: string){
        if (this.intoMainArray){
            this.mainArray.push(cadena);
        }else{
            this.subrutinasArray.push(cadena);
        }
    }

}*/