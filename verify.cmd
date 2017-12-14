@quantum-script --execution-time-cmd "%0"
@exit %errorlevel%

//
// Browser Automaton Extension
//
// Copyright (c) 2017 Grigore Stefan, <g_stefan@yahoo.com>
// Created by Grigore Stefan <g_stefan@yahoo.com>
//
// The MIT License (MIT) <http://opensource.org/licenses/MIT>
//

Script.requireExtension("Console");
Script.requireExtension("Shell");

Shell.setenv("PATH","C:\\Program Files (x86)\\Google\\Chrome\\Application;"+Shell.getenv("PATH"));
var url="http://localhost/browser-automaton/browser-automaton.php?extension=23ab9c0e7b432f42000005202e2cfa11889bd299e36232cc53dbc91bc384f9b3";
var cmd="chrome --disable-extensions-file-access-check --no-pings --disable-background-mode --load-extension=\""+Shell.getcwd()+"\\source\" --no-first-run --homepage \""+url+"\"";
Console.writeLn(cmd);
Shell.system(cmd);
