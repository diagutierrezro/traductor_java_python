import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CharStreams, CommonTokenStream } from 'antlr4ts';
import { ParseTree } from 'antlr4ts/tree/ParseTree';
import { ParseTreeWalker} from 'antlr4ts/tree/ParseTreeWalker'
import { Java8Lexer } from 'Java8Lexer';
import { Java8Parser } from 'Java8Parser';
import { SL2Java } from './traductor_java';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  code: string = "";
  traductor: FormGroup;
  cambio$: any;
  traduccion: string;
  lexer: Java8Lexer ;
  tokens: CommonTokenStream;
  parser: Java8Parser;
  tree: ParseTree;
  walker: ParseTreeWalker;
  listener: SL2Java
  editorOptions = {theme: 'vs-dark', language: 'javascript'};
  

  constructor(
    private fb: FormBuilder
  ) {
    this.code = "";
    this.traduccion = "";
  }
  ngOnInit() {
    this.crearFormulario()
    this.cambio$ = this.traductor.valueChanges.subscribe(action => {
      console.log(this.traductor)
    })
  }

  crearFormulario() {
    this.traductor = this.fb.group({
      texto: ['', Validators.required],
      textoTraducido: ['']
    });
  }

  traducir() {
    this.lexer = new Java8Lexer(CharStreams.fromString(this.traductor.value.texto))
    this.tokens = new CommonTokenStream(this.lexer)
    this.parser = new Java8Parser(this.tokens)
    this.tree = this.parser.compilationUnit()
    this.walker = new ParseTreeWalker()
    this.listener = new SL2Java()
    this.walker.walk(this.listener, this.tree)
    this.traductor.patchValue({
      textoTraducido: this.listener.traduccion
    })
  }
}
