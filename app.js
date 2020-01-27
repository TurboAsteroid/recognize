#!/usr/bin/env node
var express = require('express');
var path = require('path');
var config = require('./config');
var moment = require('moment');
var fs = require('fs');
var http = require('http');
var https = require('https');
var getRawBody = require('raw-body');
var spawn = require("child_process").spawn;
// var pythonProcess = spawn('python',["./python/facerec_from_webcam_faster.py"]);
var pythonProcess = spawn('python',["./python/face_recognition_knn.py"]);
exports.pythonProcess = pythonProcess;
var formidable = require('formidable');
var url = require('url');
var mysql = require('mysql');


var jso = {
    2304: {
        emp_id: 2304,
        last_name: 'Колотушкин',
        first_name: 'Владимир',
        StoreName7: 'Сергеевич',
        StoreName8: 'Директор АО «Уралэлектромедь»',
        checks:
            [ { dt: '31.05.2018 17:33:36', point: 'ИК - Турникет 2 выход' },
                { dt: '31.05.2018 13:07:17', point: 'ИК - Турникет 1 вход' },
                { dt: '31.05.2018 12:55:38', point: 'ИК - Турникет 2 выход' },
                { dt: '31.05.2018 09:47:12', point: '1 эт.Зап.вых.Лев.кр Счит.на вход' },
                { dt: '31.05.2018 09:43:54', point: '1 эт.Зап.вых.Лев.кр Счит.на выход' },
                { dt: '31.05.2018 08:27:32', point: 'ИК - Турникет 1 вход' },
                { dt: '30.05.2018 17:33:57', point: 'ИК - Турникет 2 выход' },
                { dt: '30.05.2018 17:33:57', point: 'Разные' },
                { dt: '30.05.2018 08:10:55', point: 'ИК - Турникет 2 вход' },
                { dt: '29.05.2018 17:33:43', point: 'ИК - Турникет 2 выход' },
                { dt: '29.05.2018 17:32:30', point: 'ИК - Турникет 1 вход' },
                { dt: '29.05.2018 13:03:05', point: 'ИК - Турникет 2 выход' },
                { dt: '29.05.2018 12:25:38', point: 'ИК - Турникет 1 вход' },
                { dt: '29.05.2018 09:24:00', point: 'ИК - Турникет 2 выход' },
                { dt: '29.05.2018 09:24:00', point: 'ИК - Турникет 2 выход' },
                { dt: '29.05.2018 08:15:59', point: 'ИК - Турникет 2 вход' },
                { dt: '28.05.2018 17:34:56', point: 'ИК - Турникет 2 выход' },
                { dt: '28.05.2018 08:06:23', point: 'ИК - Турникет 1 вход' },
                { dt: '25.05.2018 17:34:21', point: 'ИК - Турникет 2 выход' },
                { dt: '25.05.2018 12:07:56', point: 'ИК - Турникет 1 вход' },
                { dt: '01.06.2018 08:34:04', point: 'ИК - Турникет 1 вход' }
            ]
    },
    2705: {
        emp_id: 2705,
        last_name: 'Суплаков',
        first_name: 'Александр',
        StoreName7: 'Александрович',
        StoreName8: 'Директор по международным связям',
        checks:
            [ { dt: '31.05.2018 17:33:36', point: 'ИК - Турникет 2 выход' },
                { dt: '31.05.2018 13:07:17', point: 'ИК - Турникет 1 вход' },
                { dt: '31.05.2018 12:55:38', point: 'ИК - Турникет 2 выход' },
                { dt: '31.05.2018 09:47:12', point: '1 эт.Зап.вых.Лев.кр Счит.на вход' },
                { dt: '31.05.2018 09:43:54', point: '1 эт.Зап.вых.Лев.кр Счит.на выход' },
                { dt: '31.05.2018 08:27:32', point: 'ИК - Турникет 1 вход' },
                { dt: '30.05.2018 17:33:57', point: 'ИК - Турникет 2 выход' },
                { dt: '30.05.2018 17:33:57', point: 'Разные' },
                { dt: '30.05.2018 08:10:55', point: 'ИК - Турникет 2 вход' },
                { dt: '29.05.2018 17:33:43', point: 'ИК - Турникет 2 выход' },
                { dt: '29.05.2018 17:32:30', point: 'ИК - Турникет 1 вход' },
                { dt: '29.05.2018 13:03:05', point: 'ИК - Турникет 2 выход' },
                { dt: '29.05.2018 12:25:38', point: 'ИК - Турникет 1 вход' },
                { dt: '29.05.2018 09:24:00', point: 'ИК - Турникет 2 выход' },
                { dt: '29.05.2018 09:24:00', point: 'ИК - Турникет 2 выход' },
                { dt: '29.05.2018 08:15:59', point: 'ИК - Турникет 2 вход' },
                { dt: '28.05.2018 17:34:56', point: 'ИК - Турникет 2 выход' },
                { dt: '28.05.2018 08:06:23', point: 'ИК - Турникет 1 вход' },
                { dt: '25.05.2018 17:34:21', point: 'ИК - Турникет 2 выход' },
                { dt: '25.05.2018 12:07:56', point: 'ИК - Турникет 1 вход' },
                { dt: '01.06.2018 08:34:04', point: 'ИК - Турникет 1 вход' }
            ]},
    2766: {
        emp_id: 2766,
        last_name: 'Стародубцев',
        first_name: 'Сергей',
        StoreName7: 'Николаевич',
        StoreName8: 'Директор по работе с персоналом',
        checks:
            [ { dt: '31.05.2018 17:33:36', point: 'ИК - Турникет 2 выход' },
                { dt: '31.05.2018 13:07:17', point: 'ИК - Турникет 1 вход' },
                { dt: '31.05.2018 12:55:38', point: 'ИК - Турникет 2 выход' },
                { dt: '31.05.2018 09:47:12', point: '1 эт.Зап.вых.Лев.кр Счит.на вход' },
                { dt: '31.05.2018 09:43:54', point: '1 эт.Зап.вых.Лев.кр Счит.на выход' },
                { dt: '31.05.2018 08:27:32', point: 'ИК - Турникет 1 вход' },
                { dt: '30.05.2018 17:33:57', point: 'ИК - Турникет 2 выход' },
                { dt: '30.05.2018 17:33:57', point: 'Разные' },
                { dt: '30.05.2018 08:10:55', point: 'ИК - Турникет 2 вход' },
                { dt: '29.05.2018 17:33:43', point: 'ИК - Турникет 2 выход' },
                { dt: '29.05.2018 17:32:30', point: 'ИК - Турникет 1 вход' },
                { dt: '29.05.2018 13:03:05', point: 'ИК - Турникет 2 выход' },
                { dt: '29.05.2018 12:25:38', point: 'ИК - Турникет 1 вход' },
                { dt: '29.05.2018 09:24:00', point: 'ИК - Турникет 2 выход' },
                { dt: '29.05.2018 09:24:00', point: 'ИК - Турникет 2 выход' },
                { dt: '29.05.2018 08:15:59', point: 'ИК - Турникет 2 вход' },
                { dt: '28.05.2018 17:34:56', point: 'ИК - Турникет 2 выход' },
                { dt: '28.05.2018 08:06:23', point: 'ИК - Турникет 1 вход' },
                { dt: '25.05.2018 17:34:21', point: 'ИК - Турникет 2 выход' },
                { dt: '25.05.2018 12:07:56', point: 'ИК - Турникет 1 вход' },
                { dt: '01.06.2018 08:34:04', point: 'ИК - Турникет 1 вход' }
            ]},
    2898: {
        emp_id: 2898,
        last_name: 'Савин',
        first_name: 'Сергей',
        StoreName7: 'Евгеньевич',
        StoreName8: 'Директор по информационным технологиям',
        checks:
            [ { dt: '31.05.2018 17:33:36', point: 'ИК - Турникет 2 выход' },
                { dt: '31.05.2018 13:07:17', point: 'ИК - Турникет 1 вход' },
                { dt: '31.05.2018 12:55:38', point: 'ИК - Турникет 2 выход' },
                { dt: '31.05.2018 09:47:12', point: '1 эт.Зап.вых.Лев.кр Счит.на вход' },
                { dt: '31.05.2018 09:43:54', point: '1 эт.Зап.вых.Лев.кр Счит.на выход' },
                { dt: '31.05.2018 08:27:32', point: 'ИК - Турникет 1 вход' },
                { dt: '30.05.2018 17:33:57', point: 'ИК - Турникет 2 выход' },
                { dt: '30.05.2018 17:33:57', point: 'Разные' },
                { dt: '30.05.2018 08:10:55', point: 'ИК - Турникет 2 вход' },
                { dt: '29.05.2018 17:33:43', point: 'ИК - Турникет 2 выход' },
                { dt: '29.05.2018 17:32:30', point: 'ИК - Турникет 1 вход' },
                { dt: '29.05.2018 13:03:05', point: 'ИК - Турникет 2 выход' },
                { dt: '29.05.2018 12:25:38', point: 'ИК - Турникет 1 вход' },
                { dt: '29.05.2018 09:24:00', point: 'ИК - Турникет 2 выход' },
                { dt: '29.05.2018 09:24:00', point: 'ИК - Турникет 2 выход' },
                { dt: '29.05.2018 08:15:59', point: 'ИК - Турникет 2 вход' },
                { dt: '28.05.2018 17:34:56', point: 'ИК - Турникет 2 выход' },
                { dt: '28.05.2018 08:06:23', point: 'ИК - Турникет 1 вход' },
                { dt: '25.05.2018 17:34:21', point: 'ИК - Турникет 2 выход' },
                { dt: '25.05.2018 12:07:56', point: 'ИК - Турникет 1 вход' },
                { dt: '01.06.2018 08:34:04', point: 'ИК - Турникет 1 вход' }
            ]},
    3253: {
        emp_id: 3253,
        last_name: 'Ульянов',
        first_name: 'Игорь',
        StoreName7: 'Владимирович',
        StoreName8: 'Директор по коммерческим и финансовым вопросам',
        checks:
            [ { dt: '31.05.2018 17:33:36', point: 'ИК - Турникет 2 выход' },
                { dt: '31.05.2018 13:07:17', point: 'ИК - Турникет 1 вход' },
                { dt: '31.05.2018 12:55:38', point: 'ИК - Турникет 2 выход' },
                { dt: '31.05.2018 09:47:12', point: '1 эт.Зап.вых.Лев.кр Счит.на вход' },
                { dt: '31.05.2018 09:43:54', point: '1 эт.Зап.вых.Лев.кр Счит.на выход' },
                { dt: '31.05.2018 08:27:32', point: 'ИК - Турникет 1 вход' },
                { dt: '30.05.2018 17:33:57', point: 'ИК - Турникет 2 выход' },
                { dt: '30.05.2018 17:33:57', point: 'Разные' },
                { dt: '30.05.2018 08:10:55', point: 'ИК - Турникет 2 вход' },
                { dt: '29.05.2018 17:33:43', point: 'ИК - Турникет 2 выход' },
                { dt: '29.05.2018 17:32:30', point: 'ИК - Турникет 1 вход' },
                { dt: '29.05.2018 13:03:05', point: 'ИК - Турникет 2 выход' },
                { dt: '29.05.2018 12:25:38', point: 'ИК - Турникет 1 вход' },
                { dt: '29.05.2018 09:24:00', point: 'ИК - Турникет 2 выход' },
                { dt: '29.05.2018 09:24:00', point: 'ИК - Турникет 2 выход' },
                { dt: '29.05.2018 08:15:59', point: 'ИК - Турникет 2 вход' },
                { dt: '28.05.2018 17:34:56', point: 'ИК - Турникет 2 выход' },
                { dt: '28.05.2018 08:06:23', point: 'ИК - Турникет 1 вход' },
                { dt: '25.05.2018 17:34:21', point: 'ИК - Турникет 2 выход' },
                { dt: '25.05.2018 12:07:56', point: 'ИК - Турникет 1 вход' },
                { dt: '01.06.2018 08:34:04', point: 'ИК - Турникет 1 вход' }
            ]},
    15541: {
        emp_id: 15541,
        last_name: 'Медведев',
        first_name: 'Мирослав',
        StoreName7: 'Робертович',
        StoreName8: 'Директор по общим вопросам',
        checks:
            [ { dt: '31.05.2018 17:33:36', point: 'ИК - Турникет 2 выход' },
                { dt: '31.05.2018 13:07:17', point: 'ИК - Турникет 1 вход' },
                { dt: '31.05.2018 12:55:38', point: 'ИК - Турникет 2 выход' },
                { dt: '31.05.2018 09:47:12', point: '1 эт.Зап.вых.Лев.кр Счит.на вход' },
                { dt: '31.05.2018 09:43:54', point: '1 эт.Зап.вых.Лев.кр Счит.на выход' },
                { dt: '31.05.2018 08:27:32', point: 'ИК - Турникет 1 вход' },
                { dt: '30.05.2018 17:33:57', point: 'ИК - Турникет 2 выход' },
                { dt: '30.05.2018 17:33:57', point: 'Разные' },
                { dt: '30.05.2018 08:10:55', point: 'ИК - Турникет 2 вход' },
                { dt: '29.05.2018 17:33:43', point: 'ИК - Турникет 2 выход' },
                { dt: '29.05.2018 17:32:30', point: 'ИК - Турникет 1 вход' },
                { dt: '29.05.2018 13:03:05', point: 'ИК - Турникет 2 выход' },
                { dt: '29.05.2018 12:25:38', point: 'ИК - Турникет 1 вход' },
                { dt: '29.05.2018 09:24:00', point: 'ИК - Турникет 2 выход' },
                { dt: '29.05.2018 09:24:00', point: 'ИК - Турникет 2 выход' },
                { dt: '29.05.2018 08:15:59', point: 'ИК - Турникет 2 вход' },
                { dt: '28.05.2018 17:34:56', point: 'ИК - Турникет 2 выход' },
                { dt: '28.05.2018 08:06:23', point: 'ИК - Турникет 1 вход' },
                { dt: '25.05.2018 17:34:21', point: 'ИК - Турникет 2 выход' },
                { dt: '25.05.2018 12:07:56', point: 'ИК - Турникет 1 вход' },
                { dt: '01.06.2018 08:34:04', point: 'ИК - Турникет 1 вход' }
            ]},
    15721: {
        emp_id: 15721,
        last_name: 'Русаков',
        first_name: 'Дмитрий',
        StoreName7: 'Владимирович',
        StoreName8: 'Директор по безопасности и правовым вопросам',
        checks:
            [ { dt: '31.05.2018 17:33:36', point: 'ИК - Турникет 2 выход' },
                { dt: '31.05.2018 13:07:17', point: 'ИК - Турникет 1 вход' },
                { dt: '31.05.2018 12:55:38', point: 'ИК - Турникет 2 выход' },
                { dt: '31.05.2018 09:47:12', point: '1 эт.Зап.вых.Лев.кр Счит.на вход' },
                { dt: '31.05.2018 09:43:54', point: '1 эт.Зап.вых.Лев.кр Счит.на выход' },
                { dt: '31.05.2018 08:27:32', point: 'ИК - Турникет 1 вход' },
                { dt: '30.05.2018 17:33:57', point: 'ИК - Турникет 2 выход' },
                { dt: '30.05.2018 17:33:57', point: 'Разные' },
                { dt: '30.05.2018 08:10:55', point: 'ИК - Турникет 2 вход' },
                { dt: '29.05.2018 17:33:43', point: 'ИК - Турникет 2 выход' },
                { dt: '29.05.2018 17:32:30', point: 'ИК - Турникет 1 вход' },
                { dt: '29.05.2018 13:03:05', point: 'ИК - Турникет 2 выход' },
                { dt: '29.05.2018 12:25:38', point: 'ИК - Турникет 1 вход' },
                { dt: '29.05.2018 09:24:00', point: 'ИК - Турникет 2 выход' },
                { dt: '29.05.2018 09:24:00', point: 'ИК - Турникет 2 выход' },
                { dt: '29.05.2018 08:15:59', point: 'ИК - Турникет 2 вход' },
                { dt: '28.05.2018 17:34:56', point: 'ИК - Турникет 2 выход' },
                { dt: '28.05.2018 08:06:23', point: 'ИК - Турникет 1 вход' },
                { dt: '25.05.2018 17:34:21', point: 'ИК - Турникет 2 выход' },
                { dt: '25.05.2018 12:07:56', point: 'ИК - Турникет 1 вход' },
                { dt: '01.06.2018 08:34:04', point: 'ИК - Турникет 1 вход' }
            ]},
    20247: {
        emp_id: 20247,
        last_name: 'Миронов',
        first_name: 'Вадим',
        StoreName7: 'Владимирович',
        StoreName8: 'Директор по строительству и реконструкции',
        checks:
            [ { dt: '31.05.2018 17:33:36', point: 'ИК - Турникет 2 выход' },
                { dt: '31.05.2018 13:07:17', point: 'ИК - Турникет 1 вход' },
                { dt: '31.05.2018 12:55:38', point: 'ИК - Турникет 2 выход' },
                { dt: '31.05.2018 09:47:12', point: '1 эт.Зап.вых.Лев.кр Счит.на вход' },
                { dt: '31.05.2018 09:43:54', point: '1 эт.Зап.вых.Лев.кр Счит.на выход' },
                { dt: '31.05.2018 08:27:32', point: 'ИК - Турникет 1 вход' },
                { dt: '30.05.2018 17:33:57', point: 'ИК - Турникет 2 выход' },
                { dt: '30.05.2018 17:33:57', point: 'Разные' },
                { dt: '30.05.2018 08:10:55', point: 'ИК - Турникет 2 вход' },
                { dt: '29.05.2018 17:33:43', point: 'ИК - Турникет 2 выход' },
                { dt: '29.05.2018 17:32:30', point: 'ИК - Турникет 1 вход' },
                { dt: '29.05.2018 13:03:05', point: 'ИК - Турникет 2 выход' },
                { dt: '29.05.2018 12:25:38', point: 'ИК - Турникет 1 вход' },
                { dt: '29.05.2018 09:24:00', point: 'ИК - Турникет 2 выход' },
                { dt: '29.05.2018 09:24:00', point: 'ИК - Турникет 2 выход' },
                { dt: '29.05.2018 08:15:59', point: 'ИК - Турникет 2 вход' },
                { dt: '28.05.2018 17:34:56', point: 'ИК - Турникет 2 выход' },
                { dt: '28.05.2018 08:06:23', point: 'ИК - Турникет 1 вход' },
                { dt: '25.05.2018 17:34:21', point: 'ИК - Турникет 2 выход' },
                { dt: '25.05.2018 12:07:56', point: 'ИК - Турникет 1 вход' },
                { dt: '01.06.2018 08:34:04', point: 'ИК - Турникет 1 вход' }
            ]},
    1258: {
        emp_id: 1258,
        last_name: 'Королев',
        first_name: 'Алексей',
        StoreName7: 'Анатольевич',
        StoreName8: 'Главный инженер',
        checks:
            [ { dt: '31.05.2018 17:33:36', point: 'ИК - Турникет 2 выход' },
                { dt: '31.05.2018 13:07:17', point: 'ИК - Турникет 1 вход' },
                { dt: '31.05.2018 12:55:38', point: 'ИК - Турникет 2 выход' },
                { dt: '31.05.2018 09:47:12', point: '1 эт.Зап.вых.Лев.кр Счит.на вход' },
                { dt: '31.05.2018 09:43:54', point: '1 эт.Зап.вых.Лев.кр Счит.на выход' },
                { dt: '31.05.2018 08:27:32', point: 'ИК - Турникет 1 вход' },
                { dt: '30.05.2018 17:33:57', point: 'ИК - Турникет 2 выход' },
                { dt: '30.05.2018 17:33:57', point: 'Разные' },
                { dt: '30.05.2018 08:10:55', point: 'ИК - Турникет 2 вход' },
                { dt: '29.05.2018 17:33:43', point: 'ИК - Турникет 2 выход' },
                { dt: '29.05.2018 17:32:30', point: 'ИК - Турникет 1 вход' },
                { dt: '29.05.2018 13:03:05', point: 'ИК - Турникет 2 выход' },
                { dt: '29.05.2018 12:25:38', point: 'ИК - Турникет 1 вход' },
                { dt: '29.05.2018 09:24:00', point: 'ИК - Турникет 2 выход' },
                { dt: '29.05.2018 09:24:00', point: 'ИК - Турникет 2 выход' },
                { dt: '29.05.2018 08:15:59', point: 'ИК - Турникет 2 вход' },
                { dt: '28.05.2018 17:34:56', point: 'ИК - Турникет 2 выход' },
                { dt: '28.05.2018 08:06:23', point: 'ИК - Турникет 1 вход' },
                { dt: '25.05.2018 17:34:21', point: 'ИК - Турникет 2 выход' },
                { dt: '25.05.2018 12:07:56', point: 'ИК - Турникет 1 вход' },
                { dt: '01.06.2018 08:34:04', point: 'ИК - Турникет 1 вход' }
            ]}
};

pythonProcess.on('error', function(err){
    console.log('Error while processing task1:' + err.stack);
});
pythonProcess.on('error', function(err){
    console.log('Error while processing task1:' + err.stack);
});

var app = express();
app.use(function (req, res, next) {
    if (req.url == '/photo' && req.method.toLowerCase() == 'post') {
        var form = new formidable.IncomingForm();

        form.parse(req, function(err, fields, files) {
            if (err) return next(err);
            if (fields) {
                req.fields = fields;
            }
            if (files) {
                req.files = files;
            }
            next();
        });
    } else if (req.url == '/takePhoto' && req.method.toLowerCase() == 'post') {
        getRawBody(req, {
            length: req.headers['content-length'],
            limit: '50mb'
        }, function (err, string) {
            if (err) return next(err);
            if (string) {
                req.text = string;
            }
            next();
        })
    }
    next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('portHttps', config.portHttps);
app.set('portHttp', config.portHttp);
app.set('dbHost', config.dbHost);
app.set('dbDatabase', config.dbDatabase);
app.set('dbUser', config.dbUser);
app.set('dbPassword', config.dbPassword);
app.set('dbPort', config.dbPassword);
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

moment.locale('ru');

var db_config = {
    host: app.get('dbHost'),
    user: app.get('dbUser'),
    password: app.get('dbPassword'),
    database: app.get('dbDatabase')
};
var sqlconnect;

function handleDisconnect() {
    sqlconnect = mysql.createConnection(db_config);
    sqlconnect.connect(function(err) {
        if(err) {
            console.log('error when connecting to db:', err);
            setTimeout(handleDisconnect, 2000);
        } else {
            console.log('db connect');
        }
    });
    sqlconnect.on('error', function(err) {
        console.log('db error', err);
        if(err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleDisconnect();
        } else {
            throw err;
        }
    });
}
handleDisconnect();

/**
 * Create HTTP server.
 */

var server = https.createServer({
    key: fs.readFileSync('./cert/privatekey.pem'),
    cert: fs.readFileSync('./cert/cert.pem'),
    passphrase: 'qwerty'
}, app);
var io = require('socket.io')(server);

server.listen(app.get('portHttps'));


server.on('error', onError);
server.on('listening', onListening);


var socketrequest = [];
var androidrequest = [];
exports.socketrequest = socketrequest;
io.on('connection', function(ioserver){
    console.log("::: to server connected", ioserver.id);
    ioserver.on('disconnect', function(){
        console.log("::: server disconnected");
    });
    ioserver.on('sendimg', function(msg){
        var file = msg.split("|||***|||");
        socketrequest[file[0]] = ioserver.id;
        console.log(socketrequest);
        fs.writeFileSync("./upload/" + file[0], new Buffer(file[1] + '', 'base64'));
        pythonProcess.stdin.write(file[0] + "\n");
    });

});

function pythonanswer(id, user_data) {
    console.log(user_data, socketrequest);
    if (socketrequest[id]) {
        user_data["photo"] = id;
        io.to(socketrequest[id]).emit('pythonanswer', user_data);
        delete socketrequest[id];
    } else {
        androidrequest[id] = user_data[2];
    }
}

String.prototype.decodeEscapeSequence = function() {
    return this.replace(/\\x([0-9A-Fa-fa-яА-Я]{2})/g, function() {
        return String.fromCharCode(parseInt(arguments[1], 16));
    });
};

pythonProcess.stdout.on('data', function (data){
    var answer = data.toString().trim().split("|||***|||");
    //console.log("!!!!!!!!!!!!!!!!!!!!!!!!", answer);
    //answer[1] = 14847;
    // answer[1] = 2898;
    //answer[1] = 17626;
    if ((answer[1] && answer[1] == 'unknown') || answer[1] == "")  {
        pythonanswer(answer[0], []);
        photoLogAndMove("unknown", answer[0], "");
    } else if (jso[answer[1]]) {
        pythonanswer(answer[0], jso[answer[1]]);
    } else {
        var query1 = 'select * from search join cards on cards.emp_id = search.emp_id where search.emp_id = ' + answer[1];
        var query2 = '(select DATE_FORMAT(dt, "%d.%m.%Y %H:%i:%s") as dt, point from search' +
            '      join cards on cards.emp_id = search.emp_id' +
            '      join sipass_checks on sipass_checks.emp_id = search.emp_id' +
            '      where search.emp_id = ' + answer[1] + ' and DATEDIFF(NOW(), dt) < 31 )' +
            'UNION ALL' +
            '(      select DATE_FORMAT(dt, "%d.%m.%Y %H:%i:%s") as dt, point from search' +
            '      join cards on cards.emp_id = search.emp_id' +
            '      join tuxuu_checks on tuxuu_checks.card_no = search.card_no and tuxuu_checks.facility = cards.facility' +
            '      where search.emp_id = ' + answer[1] + ' and DATEDIFF(NOW(), dt) < 31)' +
            'order by dt desc';
        sqlconnect.query(query1, function (err, result, fields) {
            if (err) throw err;
            result1 = JSON.parse(JSON.stringify(result));
            sqlconnect.query(query2, function (err, result, fields) {
                if (err) throw err;
                if (result1[0]) {
                    result2 = JSON.parse(JSON.stringify(result));
                    result1[0]['checks'] = result2;
                    pythonanswer(answer[0], result1[0]);
                } else {
                    pythonanswer(answer[0], []);
                }
            });

        });
    }
});

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
}

//
//
// var usersArray = {
//     "1": {
//         name1: "Савин",
//         name2: "Сергей",
//         name3: "Евгеньевич",
//         position: "Директор по информационным технологиям",
//         image: "1.jpg"
//     },
//     "2": {
//         name1: "Скорынин",
//         name2: "Степан",
//         name3: "Геннадьевич",
//         position: "Начальник отдела ИТ",
//         image: "1.png"
//     },
//     "3": {
//         name1: "Лобарев",
//         name2: "Василий",
//         name3: "Олегович",
//         position: "Главный специалист отдела ИТ",
//         image: "i.jpg"
//     },
//     "4": {
//         name1: "Шумилова",
//         name2: "Алена",
//         name3: "Олеговна",
//         position: "Начальник бюро, ОСИСиПКИС",
//         image: "2.png"
//     },
//     "5": {
//         name1: "Шабуров",
//         name2: "Александр",
//         name3: "Владимирович",
//         position: "Заместитель начальника отдела-Начальник бюро, отдел ИТ",
//         image: "4.png"
//     },
//     "6": {
//         name1: "Берняев",
//         name2: "Павел",
//         name3: "Олегович",
//         position: "Ведущий специалист отдела ИТ",
//         image: "5.png"
//     },
//     "7": {
//         name1: "Колотушкин",
//         name2: "Владимир",
//         name3: "Сергеевич",
//         position: "Директор АО «Уралэлектромедь»",
//         image: "5.jpg"
//     },
//     "8": {
//         name1: "Каблов",
//         name2: "Сергей",
//         name3: "Германович",
//         position: "Заместитель директора АО «Уралэлектромедь» по организации режима и охраны",
//         image: "1.png"
//     }
// };
//

/* ----------------------- Routing -------------------------- */

app.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});
app.post('/takePhoto/', function (req, res) {
    var filename = Date.now() + ".png";
    fs.writeFileSync("./upload/" + filename, new Buffer(req.text + '', 'base64'));
    console.warn(filename);
    pythonProcess.stdin.write(filename + "\n");
});

app.post('/photo/', function (req, res) {
    fs.renameSync(req.files.photo.path, "./upload/" + req.files.photo.name);
    pythonProcess.stdin.write(req.files.photo.name + "\n");
    console.warn("################## photo", req.files.photo.name);
    res.sendStatus(200);
});
app.get('/photo/', function (req, res) {
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;

    console.warn("androidrequest", androidrequest, query.name);
    var result = "";
    if (androidrequest[query.name] != undefined) {
        if (usersArray[androidrequest[query.name]]) {
            var curUser = usersArray[androidrequest[query.name]];
            result += "1-!!-";
            result += curUser.name1 + "-!!-";
            result += curUser.name2 + "-!!-";
            result += curUser.name3 + "-!!-";
            result += curUser.position;
        } else {
            result += "1-!!-";
            result += "Не найден-!!-";
            result += " -!!-";
            result += " -!!-";
            result += " ";
        }
        delete androidrequest[query.name];

        console.warn("ok");
        res.send(result);

    } else {
        result += "0";
        console.warn("wait");
        res.send(result);
    }
    //res.json({name: 1, id: 2});
});

var stat = {
    success: 0,
    unknown: 0,
    error: 0
};
function photoLogAndMove(status, photoName, user) {
    switch(status) {
        case "success":
            if (!fs.existsSync("./photocheck/" + status + "/" + user + "/")){
                fs.mkdirSync("./photocheck/" + status + "/" + user + "/");
            }
            fs.renameSync("./upload/"+photoName, "./photocheck/" + status + "/" + user + "/"+ photoName);
            break;
        case "unknown":
            fs.renameSync("./upload/"+photoName, "./photocheck/" + status + "/"+ photoName);
            break;
        case "error":
            if (!fs.existsSync("./photocheck/" + status + "/" + user + "/")){
                fs.mkdirSync("./photocheck/" + status + "/" + user + "/");
            }
            if (!fs.existsSync("./photocheck/" + status + "/" + user + "/" + user + ".jpg")){
                fs.createReadStream("./public/face_tmp/"+ user+ "/" + user + ".jpg").pipe(fs.createWriteStream("./photocheck/" + status + "/" + user + "/" + user + ".jpg"));
            }
            if (!fs.existsSync("./photocheck/" + status + "/" + user + "/peoples/")){
                fs.mkdirSync("./photocheck/" + status + "/" + user + "/peoples/");
            }
            fs.renameSync("./upload/"+photoName, "./photocheck/" + status + "/" + user + "/peoples/"+ photoName);
            break;
    }
    stat[status]++;
    console.warn(stat);
}
app.post('/logphoto/', function (req, res) {
    photoLogAndMove(req.body.status, req.body.photo, req.body.user);
    res.sendStatus(200);
});
app.get('/c/', function(req, res, next) {
    res.sendFile(path.join(__dirname+'/views/c.html'));
});