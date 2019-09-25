//
//  main.m
//  12306-Tool
//
//  Created by 0x00000cc on 2018/12/19.
//  Copyright © 2018 侯猛. All rights reserved.
//

/// 列车编号
#define FunctionType true
/// 火车站名
//#define FunctionType false

#define PathHeader(path) [NSString stringWithFormat:@"/Users/HouMeng/Documents%@", path]

#import <Foundation/Foundation.h>

int main(int argc, const char * argv[]) {
    @autoreleasepool {
        
        if (FunctionType) {
            // 列车编号 js 文件
            // https://kyfw.12306.cn/otn/resources/js/query/train_list.js
            
            // 火车站名
            // https://kyfw.12306.cn/otn/resources/js/framework/station_name.js
            
            // 获取文件
            NSString *path = PathHeader(@"/GitHub/xTeko/12306-Tool/12306-Tool/train_list.js");
            // 将文件数据化
            NSData *data = [[NSData alloc] initWithContentsOfFile:path];
            // 对数据进行JSON格式化并返回字典形式
            NSString *dataString = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
            dataString = [dataString stringByReplacingOccurrencesOfString:@"var train_list =" withString:@""];
            NSData *newData = [dataString dataUsingEncoding:NSUTF8StringEncoding];
            id dataTuple = [NSJSONSerialization JSONObjectWithData:newData options:kNilOptions error:nil];
            
            [dataTuple enumerateKeysAndObjectsUsingBlock:^(id  _Nonnull key, id  _Nonnull obj, BOOL * _Nonnull stop) {
                [obj enumerateKeysAndObjectsUsingBlock:^(NSString *key, NSArray *obj, BOOL * _Nonnull stop) {
                    
                    
                    NSString *path = PathHeader(([NSString stringWithFormat:@"/GitHub/xTeko/12306-Tool/12306-Tool/%@.json", key]));
                    
                    // 将文件数据化
                    NSData *oldData = [[NSData alloc] initWithContentsOfFile:path];
                    // 对数据进行JSON格式化并返回字典形式
                    id oldDataTuple = [NSJSONSerialization JSONObjectWithData:oldData options:kNilOptions error:nil];
                    
                    NSMutableDictionary *oldDataTupleM = [[NSMutableDictionary alloc] initWithDictionary:oldDataTuple];
                    
                    __block NSMutableDictionary *trainTupleM = [NSMutableDictionary dictionary];
                    
                    [obj enumerateObjectsUsingBlock:^(NSDictionary *obj, NSUInteger idx, BOOL * _Nonnull stop) {
                        NSString *station_train_code = obj[@"station_train_code"];
                        
                        NSUInteger leftLocation = [station_train_code rangeOfString:@"("].location;
                        
                        NSUInteger centerLocation = [station_train_code rangeOfString:@"-"].location;
                        
                        NSUInteger rightLocation = [station_train_code rangeOfString:@")"].location;
                        
                        NSString *train_no = obj[@"train_no"];
                        
                        NSString *trainCode = [station_train_code substringToIndex:leftLocation];
                        
                        NSString *departureStation = [station_train_code substringWithRange:NSMakeRange(leftLocation + 1, centerLocation - leftLocation - 1)];
                        
                        NSString *terminalStation = [station_train_code substringWithRange:NSMakeRange(centerLocation + 1, rightLocation - centerLocation - 1)];
                        
                        NSDictionary *oldTrainTuple = [oldDataTupleM valueForKey:trainCode];
                        
                        NSMutableArray *otherTrainNoGroup = [NSMutableArray arrayWithArray:[oldTrainTuple valueForKey:@"otherTrainNoGroup"]];
                        
                        __block BOOL alreadyExists = false;
                        [otherTrainNoGroup enumerateObjectsUsingBlock:^(NSString *  _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
                            if ([obj isEqualToString:train_no]) {
                                alreadyExists = true;
                                *stop = true;
                            }
                        }];
                        
                        if (!alreadyExists) {
                            [otherTrainNoGroup addObject:train_no];
                        }
                        
                        NSDictionary *trainTuple = @{
                                                     @"train_no":train_no,
                                                     @"trainCode":trainCode,
                                                     @"departureStation":departureStation,
                                                     @"terminalStation":terminalStation,
                                                     @"otherTrainNoGroup":otherTrainNoGroup
                                                     };
                        
                        
                        [trainTupleM setObject:trainTuple forKey:trainCode];
                    }];
                    
                    [trainTupleM enumerateKeysAndObjectsUsingBlock:^(id  _Nonnull key, id  _Nonnull obj, BOOL * _Nonnull stop) {
                        [oldDataTupleM setValue:obj forKey:key];
                    }];
                    
                    NSData *jsonData = [NSJSONSerialization dataWithJSONObject:oldDataTupleM options:NSJSONWritingPrettyPrinted error:nil];
                    
                    NSString *jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
                    
                    if ([jsonString writeToFile:path atomically:true encoding:NSUTF8StringEncoding error:nil]) {
                        NSLog(@"%@-写入成功", key);
                    }else {
                        NSLog(@"%@-写入失败", key);
                    }
                    
                }];
            }];
            
        } else {
            // 获取文件
            NSString *path = PathHeader(@"/GitHub/xTeko/12306-Tool/12306-Tool/station_name_all.json");
            NSData *data = [[NSData alloc] initWithContentsOfFile:path];
            // 对数据进行JSON格式化并返回字典形式
            NSArray *dataTuple = [NSJSONSerialization JSONObjectWithData:data options:kNilOptions error:nil];

            NSMutableDictionary *station_name_tuple = [NSMutableDictionary dictionary];
            NSMutableDictionary *station_name_anti_tuple = [NSMutableDictionary dictionary];
            NSMutableDictionary *station_name_section_tuple = [NSMutableDictionary dictionary];
            NSMutableDictionary *station_name_section_quanpin_tuple = [NSMutableDictionary dictionary];

            [dataTuple enumerateObjectsUsingBlock:^(id  _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
                NSString *station_name = obj[@"station_name"];
                NSString *station_name_code = obj[@"station_name_code"];
                NSString *station_Name_pinyin = obj[@"station_Name_pinyin"];
                NSString *station_Name_suoxie = obj[@"station_Name_suoxie"];
                NSString *station_Name_pinyin_firstLetter = obj[@"station_Name_pinyin_firstLetter"];
                [station_name_tuple setValue:station_name_code forKey:station_name];
                [station_name_anti_tuple setValue:station_name forKey:station_name_code];
                
                NSMutableArray *station_Name_pinyin_group = [NSMutableArray arrayWithArray:[station_name_section_tuple objectForKey:station_Name_pinyin_firstLetter]];
                [station_Name_pinyin_group addObject:station_name];
                [station_name_section_tuple setValue:station_Name_pinyin_group forKey:station_Name_pinyin_firstLetter];
                
                NSMutableArray *station_Name_quanpin_group = [NSMutableArray arrayWithArray:[station_name_section_quanpin_tuple objectForKey:station_Name_pinyin_firstLetter]];
                [station_Name_quanpin_group addObject:@[station_name, station_Name_pinyin, station_Name_suoxie]];
                [station_name_section_quanpin_tuple setValue:station_Name_quanpin_group forKey:station_Name_pinyin_firstLetter];
            }];

            NSMutableArray *station_Name_pinyin_sortGroup = [NSMutableArray array];
            NSMutableArray *station_Name_pinyin_indexGroup = [NSMutableArray array];
            NSMutableArray *station_Name_quanpin_sortGroup = [NSMutableArray array];
            NSMutableArray *station_Name_quanpin_indexGroup = [NSMutableArray array];

            for (NSString *word in @[@"A",@"B",@"C",@"D",@"E",@"F",@"G",@"H",@"I",@"J",@"K",@"L",@"M",@"N",@"O",@"P",@"Q",@"R",@"S",@"T",@"U",@"V",@"W",@"X",@"Y",@"Z"]) {
                NSArray *station_Name_pinyin_sortGroupI = station_name_section_tuple[word];
                NSArray *station_Name_quanpin_sortGroupI = station_name_section_quanpin_tuple[word];
                if (station_Name_pinyin_sortGroupI) {
                    [station_Name_pinyin_sortGroup addObject:@{@"title":word,@"rows":station_Name_pinyin_sortGroupI}];
                    [station_Name_pinyin_indexGroup addObject:word];
                    
                    [station_Name_quanpin_sortGroup addObject:@{@"title":word,@"rows":station_Name_quanpin_sortGroupI}];
                    [station_Name_quanpin_indexGroup addObject:word];
                }
            }

            NSDictionary *station_name_section_dataTuple = @{@"data":station_Name_pinyin_sortGroup,@"index":station_Name_pinyin_indexGroup};
            NSDictionary *station_name_section_quanpin_dataTuple = @{@"data":station_Name_quanpin_sortGroup,@"index":station_Name_quanpin_indexGroup};

            NSString *station_name_writePath = PathHeader(@"/GitHub/xTeko/12306-Tool/12306-Tool/station_name.json");
            NSString *station_name_anti_writePath = PathHeader(@"/GitHub/xTeko/12306-Tool/12306-Tool/station_name_anti.json");
            NSString *station_name_section_writePath = PathHeader(@"/GitHub/xTeko/12306-Tool/12306-Tool/station_name_section.json");
            NSString *station_name_section_quanpin_writePath = PathHeader(@"/GitHub/xTeko/12306-Tool/12306-Tool/station_name_section_quanpin.json");
            
            NSData *station_name_jsonData = [NSJSONSerialization dataWithJSONObject:station_name_tuple options:NSJSONWritingPrettyPrinted error:nil];
            NSData *station_name_anti_jsonData = [NSJSONSerialization dataWithJSONObject:station_name_anti_tuple options:NSJSONWritingPrettyPrinted error:nil];
            NSData *station_name_section_jsonData = [NSJSONSerialization dataWithJSONObject:station_name_section_dataTuple options:NSJSONWritingPrettyPrinted error:nil];
            NSData *station_name_section_quanpin_jsonData = [NSJSONSerialization dataWithJSONObject:station_name_section_quanpin_dataTuple options:NSJSONWritingPrettyPrinted error:nil];
            
            NSString *station_name_jsonString = [[NSString alloc] initWithData:station_name_jsonData encoding:NSUTF8StringEncoding];
            NSString *station_name_anti_jsonString = [[NSString alloc] initWithData:station_name_anti_jsonData encoding:NSUTF8StringEncoding];
            NSString *station_name_section_jsonString = [[NSString alloc] initWithData:station_name_section_jsonData encoding:NSUTF8StringEncoding];
            NSString *station_name_section_quanpin_jsonString = [[NSString alloc] initWithData:station_name_section_quanpin_jsonData encoding:NSUTF8StringEncoding];

            if ([station_name_jsonString writeToFile:station_name_writePath atomically:true encoding:NSUTF8StringEncoding error:nil] &&
                [station_name_anti_jsonString writeToFile:station_name_anti_writePath atomically:true encoding:NSUTF8StringEncoding error:nil] &&
                [station_name_section_jsonString writeToFile:station_name_section_writePath atomically:true encoding:NSUTF8StringEncoding error:nil] &&
                [station_name_section_quanpin_jsonString writeToFile:station_name_section_quanpin_writePath atomically:true encoding:NSUTF8StringEncoding error:nil]) {
                NSLog(@"写入成功");
            }else {
                NSLog(@"写入失败");
            }
        }
    }
    
    
    return 0;
}
