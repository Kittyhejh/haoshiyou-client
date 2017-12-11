import {Component} from "@angular/core";
import {NavParams, Button, Checkbox, ViewController} from "ionic-angular";
import {FlagService} from "../../services/flag.service";

@Component({
  templateUrl: 'filter-settings.comp.html',
  selector: 'filter-settings',
})
export class FilterSettingsComponent {

  private filterSettings = {'types': {}, 'areas': {}};

  constructor(public viewCtrl: ViewController,
              private flagService: FlagService,
              private _navParams: NavParams) {
    if (this._navParams.data) {
      console.log(" --- " + JSON.stringify(this._navParams.data));
      //TODO: get filterSettings and initial UI
      this.filterSettings = this._navParams.data['filterSettings'];
    }
  }

  public options = [
    'All',
    'SanFrancisco',
    'MidPeninsula',
    'SouthBayWest',
    'SouthBayEast',
    'EastBay',
    'ShortTerm',
    'Seattle',
    'TestGroup',
  ];

  public optionsMap = {
    'All': '全部',
    'SanFrancisco': '三番',
    'MidPeninsula': '中半岛',
    'SouthBayWest': '南湾西',
    'SouthBayEast': '南湾东',
    'EastBay': '东湾',
    'ShortTerm': '短租',
    'Seattle': '西雅图',
    'TestGroup': '测试',
  };

  private applyFilterSettings() {
    this.close();
  }

  close() {
    this.viewCtrl.dismiss({ filterSettings: this.filterSettings });
  }
}