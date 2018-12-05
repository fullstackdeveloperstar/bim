import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort } from '@angular/material';
import { DatabaseService } from '../_services/database.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-projectbim',
  templateUrl: './projectbim.component.html',
  styleUrls: ['./projectbim.component.scss']
})
export class ProjectbimComponent implements OnInit {

  tablePath = '/bims';

  isEditable = false;
  elements: TableElement[];
  selectedKey;
  editableKey;

  displayedColumns = ['number', 'bim_use', 'check', 'software', 'version', 'format'];
  dataSource = new MatTableDataSource(this.elements);

  projectId;
  stages;

  softwares = [
    "Revit",
    "Bentley BIM Suite",
    "SketchUp",
    "ArchiCAD",
    "Vectorworks",
    "Tekla Structures",
    "Vico Office",
    "Quantm",
    "Digital Project",
    "Cadpipe HVAC",
    "Fabrication CADMEP",
    "AutoCAD",
    "AutoCAD Civil 3D",
    "Robot",
    "STAAD Pro",
    "FloVent",
    "Fluent",
    "Sefaira",
    "Navisworks",
    "BIM360 Field",
    "BIM360 Glue",
    "BIM360 Layout",
    "BIM360 Plan",
    "BIM360 Docs",
    "ProectDox",
    "Project Wise",
    "Solibri Model Checker"
  ];

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private databaseService: DatabaseService,
    private router: Router
  ) { }

  ngOnInit() {

    var url = this.router.url;
    var urlItems = url.split('/');

    if(urlItems.length >= 4) {
      this. projectId = urlItems[3];

      this.databaseService.getRowDetails('projects' , this.projectId).valueChanges().subscribe(data => {
       if (data) {
          this.tablePath = this.tablePath + '/' + this.projectId;
          this.loadData();
       }else {
        this.router.navigate(['/']);
       }
      });
    } else {
      this.router.navigate(['/']);
    }

  }

  loadData() {
    // Get the stages dropdown list
    this.databaseService.getLists('/stages/' + this.projectId).valueChanges().subscribe(data => {
      this.stages = data;
    });

    this.databaseService.getLists(this.tablePath).valueChanges().subscribe(data => {
      this.elements = data;

      this.sortRecords();

      this.dataSource = new MatTableDataSource(this.elements);
    });
    
    if(this.dataSource) {
      this.dataSource.sort = this.sort;
    }
  }

  switchEditable() {
    this.isEditable = !this.isEditable;

    if (!this.isEditable) {
      this.editableKey = null;
      this.selectedKey = null;
    }
  }

  switchToggle() {
    for (let element of this.elements) {
      if (element.key == this.editableKey) {
        element.check = !element.check;
      }
    }
  }

  selectRow(key) {
    if(this.isEditable) {
      this.selectedKey = key;
    }
    
    if(this.editableKey != this.selectedKey) {
      this.editableKey = null;
    }
  }

  insertRow() {
    if(!this.editableKey) {
      var number = 0;
      var position = 0;
      for (let element of this.elements){
        if(number < element.number) {
          number = element.number;
        }

        if(position < element.position) {
          position = element.position;
        }
      }

      number++;
      position++;

      var newRow: TableElement = {number: number, bim_use: '', check:true, software: "", version: "", format: "", key: "newRow", position: position, is_new: true};
      this.selectedKey = "newRow";
      this.editableKey = this.selectedKey;
      this.elements.push(newRow);

      this.dataSource = new MatTableDataSource(this.elements);
    }
  }

  deleteRow() {console.log(this.selectedKey);
    if(this.selectedKey) {
      this.databaseService.deleteRow(this.tablePath, this.selectedKey);
    }

    if(this.selectedKey == 'newRow') {
      
    }
  }

  editRow() {
    this.editableKey = this.selectedKey;
  }

  saveRow() {
    for (let element of this.elements){
      if(element.key == 'newRow') {
        if(element.bim_use && element.format && element.software && element.version) {
          element.is_new = false;
          var result = this.databaseService.createRow(this.tablePath, element);
          element.key = result.key;
          this.databaseService.updateRow(this.tablePath, result.key, element);
        }
      }

      if(element.key == this.editableKey) {
        if(element.bim_use && element.format && element.software && element.version) {
          element.is_new = false;
          this.databaseService.updateRow(this.tablePath, this.editableKey, element);
        }
      }
    }

    this.editableKey = null;
  }

  moveUp() {
    if(!this.editableKey) {
      var index = 0;
      for (let element of this.elements){
        if(element.key == this.selectedKey && this.elements[index - 1]) {
          var position = this.elements[index]['position'];
          this.elements[index]['position'] = this.elements[index - 1]['position'];
          this.databaseService.updateRow(this.tablePath, element.key, this.elements[index]);

          this.elements[index - 1]['position'] = position;
          this.databaseService.updateRow(this.tablePath, this.elements[index - 1]['key'], this.elements[index - 1]);

          break;
        }

        index++;
      }

      this.sortRecords();
    }
  }

  moveDown() {
    if(!this.editableKey) {
      var index = 0;
      for (let element of this.elements){
        if(element.key == this.selectedKey && this.elements[index + 1]) {
          var position = this.elements[index]['position'];
          this.elements[index]['position'] = this.elements[index + 1]['position'];
          this.databaseService.updateRow(this.tablePath, element.key, this.elements[index]);

          this.elements[index + 1]['position'] = position;
          this.databaseService.updateRow(this.tablePath, this.elements[index+1]['key'], this.elements[index+1]);

          break;
        }

        index++;
      }

      this.sortRecords();
    }
  }

  sortRecords() {
    this.elements.sort(function(a, b){return a.position - b.position});
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}

export interface TableElement {
  number: number;
  bim_use: string;
  check: boolean;
  software: string;
  version: string;
  format: string;
  key?: string;
  position?: number;
  is_new?: boolean
}
