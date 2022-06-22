import { ErrorNode } from "antlr4ts/tree/ErrorNode";
import { TerminalNode } from "antlr4ts/tree/TerminalNode";
import { AdditiveExpressionContext, ArgumentListContext, AssignmentContext, ClassBodyContext, ClassBodyDeclarationContext, ClassDeclarationContext, CompilationUnitContext,
    ExpressionNameContext, FieldDeclarationContext, FormalParameterContext, FormalParameterListContext, FormalParametersContext, IfThenElseStatementContext,
    IfThenStatementContext, Java8Parser, LiteralContext, MethodBodyContext, MethodDeclaratorContext, MethodInvocationContext, MethodInvocation_lfno_primaryContext,
    MethodNameContext, NormalClassDeclarationContext, ReturnStatementContext, TypeNameContext, UnannClassType_lfno_unannClassOrInterfaceTypeContext,
    VariableDeclaratorContext, VariableDeclaratorIdContext } from "Java8Parser";

export class SL2Java {

    inArray: boolean = false;
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
    removeArray: boolean = false;
    getArray: boolean = false;
    exitsMainMethod: boolean = false;
    comaOnParamenters: boolean = false;
    mainClass: string = "";
    inBodyClass: boolean = false;
    inSentencia_retorna_subrutina: boolean = false;
    numTabs: number = 0;
    sameTerminals: string[] = ["(", ")", "[", "]"];
    mainArray: string[] = [];
    subrutinasArray: string[] = [];
    intoMainArray: boolean = true;
    traduccion: string = "";
    scannerIdentifier: string = "";
    plusOperator: boolean = false;
    numOfAdditiveExpression: number = 0;
    comaOnArguments: boolean = false;
    instanceVariable: boolean = false;
    assignVariable:boolean = false;

    constructor() {
    }

    enterCompilationUnit(ctx: CompilationUnitContext) {
        console.log("import math\n");
        console.log("import random\n");
        console.log("import psutil\n");
        console.log("import datetime\n");
        console.log("import sys\n");
    }

   exitCompilationUnit(ctx: LiteralContext) {
        let textoSubrutinas = ""
        let main = ""
        if (this.exitsMainMethod) {
            var temp = "\n\nif __name__ == '__main__':\n\n";
            temp = temp + "\t\t" + this.mainClass + ".main([])";
            this.addToArray(temp);
        }
        for (let i = 0; i < this.subrutinasArray.length; i++) {
            textoSubrutinas = textoSubrutinas + this.subrutinasArray[i]
        }
        this. traduccion = this.traduccion + textoSubrutinas
        for (let i = 0; i < this.mainArray.length; i++) {
            main = main + this.mainArray[i]
        }
        this.traduccion = this.traduccion + main
    }

    enterIfThenStatement(ctx: IfThenStatementContext) {
        this.addToArray("if(");
    }

    enterNormalClassDeclaration(ctx: NormalClassDeclarationContext) {
        if (this.inBodyClass) {
            this.numTabs += 1;
        }
        if (ctx.CLASS() != null) {
            if (this.mainClass.length == 0) {
                this.mainClass = ctx.Identifier().text;
            }
            var temp = "";
            for (let index = 0; index < this.numTabs; index++) {
                temp = temp + "\t"
            }
            temp = temp + "class" + ctx.Identifier().text + ":\n"
        }
        this.addToArray("class ")
        this.addToArray(ctx.getToken(Java8Parser.Identifier, 0).text + ":\n")
    }

    enterClassBody(ctx: ClassBodyContext) {
        this.numTabs += 1;
        var temp = ""
        for (let index = 0; index < this.numTabs; index++) {
            temp = temp
        }
        this.addToArray(temp);
    }

    enterClassBodyDeclaration(ctx: ClassBodyDeclarationContext) {
        this.inBodyClass = true;
    }

    exitClassBodyDeclaration(ctx: ClassBodyDeclarationContext) {
        this.inBodyClass = false;
    }

    enterVariableDeclaratorId(ctx: VariableDeclaratorIdContext) {
        var temp = ""
        for (let index = 0; index < this.numTabs; index++) {
            temp = temp + "\t"
        }
        if (ctx.parent.text.includes("Scanner")) {
            this.scannerIdentifier = ctx.text
        }
        else if(this.inArray == true){
            this.addToArray(temp + ctx.getToken(Java8Parser.Identifier, 0).text + " = []")
            this.inArray = false;
        }
    }

    enterVariableDeclarator(ctx: VariableDeclaratorContext) {
        var temp = ""
        for (let index = 0; index < this.numTabs; index++) {
            temp = temp + "\t"
        }
        if (!this.inArray && !ctx.text.includes("Scanner") && ctx.ASSIGN()){
            this.addToArray(temp + ctx.variableDeclaratorId().Identifier().text + " " + ctx.ASSIGN().text + " ");
        } else if (this.instanceVariable) {
            this.addToArray(ctx.variableDeclaratorId().Identifier().text);
        }
    }

    exitVariableDeclarator(ctx: VariableDeclaratorContext) {
        if (!this.inArray && !this.instanceVariable) {
            this.addToArray("\n")
        }
    }

    enterLiteral(ctx: LiteralContext) {
        if (ctx.IntegerLiteral()) {
            this.addToArray(ctx.IntegerLiteral().text)
        } else if (ctx.StringLiteral()) {
            this.addToArray(ctx.StringLiteral().text)
        } else if (ctx.FloatingPointLiteral().text) {
            this.addToArray(ctx.FloatingPointLiteral().text)
        } else if (ctx.BooleanLiteral().text) {
            this.addToArray(ctx.BooleanLiteral().text)
        }
    }

    enterUnannClassType_lfno_unannClassOrInterfaceType(ctx: UnannClassType_lfno_unannClassOrInterfaceTypeContext) {
        if (ctx.Identifier().text === "ArrayList") {
            this.inArray = true;
        }
    }

    enterMethodBody(ctx: MethodBodyContext){
        this.numTabs += 1;
    }

    exitMethodBody(ctx: MethodBodyContext){
        this.numTabs -= 1;
    }

    enterAdditiveExpression(ctx: AdditiveExpressionContext){
        if(ctx.ADD() != null){
            this.plusOperator = true;
            this.numOfAdditiveExpression += 1;
        }
    }

    exitAdditiveExpression(ctx: AdditiveExpressionContext){
        if (this.plusOperator) this.numOfAdditiveExpression -= 1;
        console.log(this.numOfAdditiveExpression)
        if(this.numOfAdditiveExpression == 0){
            this.plusOperator = false;
        }
    }

    enterMethodInvocation(ctx: MethodInvocationContext) {
        var temp = ""
        for (let index = 0; index < this.numTabs; index++) {
            temp = temp + "\t"
        }
        this.addToArray(temp + ctx.typeName().text + ".")
        if(ctx.Identifier().text === "push") {
            this.inArray = true;
            this.addToArray("append(")
        } else if (ctx.Identifier().text === "remove") {
            this.inArray = true;
            this.removeArray = true;
            this.addToArray("pop(")
        } else if( ctx.Identifier().text === "get") {
            this.getArray = true;
        }
    }

    exitMethodInvocation(ctx: MethodInvocationContext){
        this.removeArray = false;
        this.inArray = false;
        this.getArray = false;
        this.addToArray(")\n")
    }

    enterMethodInvocation_lfno_primary(ctx: MethodInvocation_lfno_primaryContext) {
        if (this.removeArray){
            if (this.intoMainArray){
                this.mainArray.pop();
            }else{
                this.subrutinasArray.pop();
            }
            this.addToArray("remove(")
            this.removeArray = false;
        } else if (ctx.Identifier().text === "parseInt") {
            this.addToArray("int(")
        } else if (ctx.typeName().text === this.scannerIdentifier) {
        } else {
            this.getArray = true;
            this.addToArray(ctx.typeName().text + "[")
        }
    }

    enterTypeName(ctx: TypeNameContext){
        if(ctx.Identifier().text === this.scannerIdentifier){
            this.addToArray("input())");
        }
    }

    enterMethodName(ctx: MethodNameContext){
        if(ctx.Identifier() != null){
            var temp = this.mainClass + "." + ctx.Identifier().text + "(";
            this.addToArray(temp);
        }
    }

    enterArgumentList(ctx: ArgumentListContext){
        if(ctx.parent.text === "println"){
            var temp = "";
            for (let index = 0; index < this.numTabs; index++) {
                temp = temp + "\t"
            }
            this.addToArray(temp + "print(");
        }
        if(ctx.COMMA() != null){
            this.comaOnArguments = true;
        }
    }

    exitArgumentList(ctx: ArgumentListContext){
        this.comaOnArguments = false;
        if(!this.comaOnArguments){
            if(this.mainArray[this.mainArray.length-1].includes(",")){
                this.mainArray.pop();
                this.addToArray(")");
            }
        }
    }

    exitMethodInvocation_lfno_primary(ctx: MethodInvocation_lfno_primaryContext) {
        this.removeArray = false;
        if (this.getArray) {
            this.addToArray("]")
            this.getArray = false;
        }
    }

    enterExpressionName (ctx: ExpressionNameContext) {
        if (ctx.Identifier().text === "length"){
            this.addToArray("len(" + ctx.ambiguousName().text + ")")
        } else if (ctx.Identifier().text !== "in") {
            var temp = ctx.Identifier().text;
            this.addToArray(temp);

            if (this.comaOnArguments) {
                this.addToArray(", ")
            }
        }
        if (this.plusOperator) {
            this.addToArray(" + ")
        }
    }

    enterReturnStatement(ctx: ReturnStatementContext){
        var temp = "";
        for (let index = 0; index < this.numTabs; index++) {
            temp = temp + "\t"
        }
        if(ctx.RETURN() != null){
            temp = temp + "return ";
        }
        this.addToArray(temp);
    }

    exitReturnStatement(ctx: ReturnStatementContext){
        var temp = "\n";
        this.addToArray(temp);
    }

    exitFormalParameterList(ctx: FormalParameterListContext){
        var temp = "):\n";
        this.addToArray(temp);
    }

    enterFormalParameters(ctx: FormalParametersContext){
        if(ctx.COMMA() != null){
            this.comaOnParamenters = true;
        }
    }

    exitFormalParameters(ctx: FormalParametersContext){
        this.comaOnParamenters = false;
    }

    enterFormalParameter(ctx: FormalParameterContext){
        var temp = ctx.variableDeclaratorId().text;
        if(this.comaOnParamenters){
            temp = temp + ",";
        }
        this.addToArray(temp);
    }

    enterMethodDeclarator(ctx: MethodDeclaratorContext) {
        var temp = ""
        for (let index = 0; index < this.numTabs; index++) {
            temp = temp + "\t"
        }
        if (ctx.Identifier().text === "main") {
            this.exitsMainMethod = true;
        }
        temp = temp + "def " + ctx.Identifier().text + "(";
        this.addToArray(temp)
    }

    enterFieldDeclaration(ctx: FieldDeclarationContext) {
        var temp = ""
        for (let index = 0; index < this.numTabs; index++) {
            temp = temp + "\t"
        }
        this.addToArray(temp)
        this.instanceVariable = true;
        if (ctx.fieldModifier()[0].text === "private") {
            this.addToArray("__")
        } else if (ctx.fieldModifier()[0].text === "protected") {
            this.addToArray("_")
        }
    }

    exitFieldDeclaration(ctx: FieldDeclarationContext) {
        if (ctx.unannType().text === "String") {
            this.addToArray(' = ""\n')
        } else if (ctx.unannType().text === "boolean") {
            this.addToArray(' = false\n')
        } else if( ctx.unannType().text === "int") {
            this.addToArray(' = 0\n')
        } else if( ctx.unannType().text === "float") {
            this.addToArray(' = 0.0\n')
        }
        this.instanceVariable = false;
    }

    enterAssignment (ctx: AssignmentContext) {
        var temp = ""
        for (let index = 0; index < this.numTabs; index++) {
            temp = temp + "\t"
        }
        this.assignVariable = true;
        this.addToArray(temp + ctx.leftHandSide().fieldAccess().Identifier().text + " = ")
    }

    exitAssignment (ctx: AssignmentContext) {
        this.addToArray("\n")
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
            /*} else if (this.sameTerminals.includes(String(node))) {
                if(this.funcionPredefinida){
                    if(String(node) === ")" ){
                        this.funcionPredefinida = false;
                    }
                }else{
                   this.addToArray(String(node));
                }*/
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

     addToArray(cadena: string){
        if (this.intoMainArray){
            this.mainArray.push(cadena);
        }else{
            this.subrutinasArray.push(cadena);
        }
    }

}