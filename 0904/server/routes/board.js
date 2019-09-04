import express from "express";
import conn from "../db/mysql.js";

const router = express.Router();
 
//전체 패키지 가져오기 
router.get('/packageList', (req, res) =>{
	conn.query("SELECT * FROM package ORDER BY num DESC", (err, results) => {
		if(err) {
			return res.send(err);
		}else {
			return res.json({
				data: results
			})
		}
	});
});

//내가 쓴 패키지 가져오기
router.post('/mine', (req, res) =>{
	console.log(req.body.id);
	const id = req.body.id;

	let sql = "SELECT * FROM package where id = ? ORDER BY num DESC";
	let post = [id];
	conn.query(sql, post, (err, results, fields) => {
		if(err) {
			return res.send(err);
		}else {
			return res.json({
				data: results
			})
		}
	});
});

//남이 쓴 패키지 가져오기
router.post('/another', (req, res) =>{
	const id = req.body.id;

	let sql = "SELECT * FROM package where not id = ? ORDER BY num DESC";
	let post = [id];
	conn.query(sql, post, (err, results, fields) => {
		if(err) {
			return res.send(err);
		}else {
			return res.json({
				data: results
			})
		}
	});
});

//풀었던 패키지 가져오기
router.post('/exist', (req, res) =>{
	const id = req.body.id;

	let sql = "SELECT package.* FROM package JOIN result ON (package.num = result.package_number AND result.email = ?) ORDER BY num DESC";
	let post = [id];
	conn.query(sql, post, (err, results, fields) => {
		if(err) {
			return res.send(err);
		}else {
			return res.json({
				data: results
			})
		}
	});
});

//풀지 않은 패키지 가져오기
router.post('/noneExist', (req, res) =>{
	const id = req.body.id;

	let sql = "SELECT * FROM package WHERE NOT EXISTS "+
	"(SELECT * FROM result WHERE package.num = result.package_number AND result.email = ?) AND NOT id = ? ORDER BY num DESC";
	let post = [id, id];
	conn.query(sql, post, (err, results, fields) => {
		if(err) {
			return res.send(err);
		}else {
			return res.json({
				data: results
			})
		}
	});
});

//패키지 등록
router.post("/packageInsert", (req, res) => {
	const title = req.body.title;
	const content = req.body.content;
	const id = req.body.id;

	let sql = "INSERT INTO package (title, content, id, count) VALUES(?,?,?,0)";
	let post = [title, content, id];
	conn.query(sql, post, (err, results, fields) => {
		if (err) {
			console.log(err);
			return res.status(400).json({
				error: "db error"
			});
		} else {
			return res.status(200).json({
				success: true,
				error: null,
				num : results.insertId
			});
		}
	});
});

//패키지 클릭했을 때 하나의 정보 가져오기
router.post("/packageSelect", (req, res) => {
	const packagenum = req.body.packagenum;

	let sql = "SELECT * FROM package where num = ?";
	let post = [packagenum];
	conn.query(sql, post, (err, results, fields) => {
		if (err) {
			console.log(err);
			return res.status(400).json({
				error: "db error"
			});
		} else {
			return res.status(200).json({
				package : results
			});
		}
	});
});

//퀴즈 등록
router.post("/quizInsert", (req, res) => {
	const quizname = req.body.quizname;
	const optionlist = req.body.optionlist;
	const tag = req.body.tag;
	const answer = req.body.answer;
	const score = req.body.score;
	const id = req.body.id;
	const level = req.body.level;
	
	/*
	const bool = req.body.bool;
	if(bool==false){
		return res.status(200).json({
			num: null
		});
	}
	*/

	let sql = "INSERT INTO quiz (quizname, optionlist, tag, answer, score, id, level) VALUES(?,?,?,?,?,?,?)";
	let post = [quizname, optionlist, tag, answer, score, id, level];
	conn.query(sql, post, (err, results, fields) => {
		if (err) {
			console.log(err);
			return res.status(400).json({
			error: "db error"
			});
		} else {
			return res.status(200).json({
				num : results.insertId
			});
		}
	});
});

//패키지-퀴즈 엮어주는 정보 등록
router.post("/package_quizInsert", (req, res) => {
	const packagenum = req.body.packagenum;
	const quiznum = req.body.quiznum;
	const number = req.body.number;

	let sql = "INSERT INTO pack_quiz (package_num, quiz_num, number) VALUES(?,?,?)";
	let post = [packagenum, quiznum, number];
	conn.query(sql, post, (err, results, fields) => {
		if (err) {
			console.log(err);
			return res.status(400).json({
			error: "db error"
			});
		} else {
			return res.status(200);
		}
	});
});

//패키지-퀴즈 엮어주는 정보 가져오기
router.post("/Get_package_quiz", (req, res) => {
	const packagenum = req.body.packagenum;

	let sql = "SELECT * FROM pack_quiz where package_num = ? ORDER BY number";
	let post = [packagenum];
	conn.query(sql, post, (err, results, fields) => {
		if (err) {
			console.log(err);
			return res.status(400).json({
			error: "db error"
			});
		} else {
			return res.status(200).json({
				num : results
			});
		}
	});
});

//전체 퀴즈 가져오기 
router.get('/quizList', (req, res) =>{
	conn.query("SELECT * FROM quiz ORDER BY num DESC", (err, results) => {
		if(err) {
			return res.send(err);
		}else {
			return res.json({
				data: results
			})
		}
	});
});


//내가 쓴 퀴즈 가져오기
router.post('/mineQuiz', (req, res) =>{
	console.log(req.body.id);
	const id = req.body.id;

	let sql = "SELECT * FROM quiz where id = ? ORDER BY num DESC";
	let post = [id];
	conn.query(sql, post, (err, results, fields) => {
		if(err) {
			return res.send(err);
		}else {
			return res.json({
				data: results
			})
		}
	});
});

//남이 쓴 퀴즈 가져오기
router.post('/anotherQuiz', (req, res) =>{
	const id = req.body.id;

	let sql = "SELECT * FROM quiz where not id = ? ORDER BY num DESC";
	let post = [id];
	conn.query(sql, post, (err, results, fields) => {
		if(err) {
			return res.send(err);
		}else {
			return res.json({
				data: results
			})
		}
	});
});

//풀었던 퀴즈 가져오기
router.post('/existQuiz', (req, res) =>{
	const id = req.body.id;

	let sql = "SELECT quiz.* FROM quiz JOIN result ON (quiz.num = result.quiz_number AND result.package_number = 0 AND result.email = ?) ORDER BY num DESC";
	let post = [id];
	conn.query(sql, post, (err, results, fields) => {
		if(err) {
			return res.send(err);
		}else {
			return res.json({
				data: results
			})
		}
	});
});

//풀지 않은 퀴즈 가져오기
router.post('/noneExistQuiz', (req, res) =>{
	const id = req.body.id;

	let sql = "SELECT * FROM quiz WHERE NOT EXISTS "+
	"(SELECT * FROM result WHERE quiz.num = result.quiz_number AND result.package_number = 0 AND result.email = ?) AND NOT id = ? ORDER BY num DESC";
	let post = [id, id];
	conn.query(sql, post, (err, results, fields) => {
		if(err) {
			return res.send(err);
		}else {
			return res.json({
				data: results
			})
		}
	});
});


//퀴즈 가져오기
router.post("/quizSelect", (req, res) => {
	const quiznum = req.body.quiznum;

	let sql = "SELECT * FROM quiz where num = ?";
	let post = [quiznum];
	conn.query(sql, post, (err, results, fields) => {
		if (err) {
			console.log(err);
			return res.status(400).json({
			error: "db error"
			});
		} else {
			return res.status(200).json({
				quiz : results
			});
		}
	});
});

//결과 등록
router.post("/resultInsert", (req, res) => {
	const package_number = req.body.packagenum;
	const quiz_number = req.body.quiznum;
	const email = req.body.id;
	const score = req.body.score;
	const quiz_answer = req.body.answer;
	const correct = req.body.correct;

	let sql = "INSERT INTO result (package_number, quiz_number, email, score, quiz_answer, correct) VALUES(?,?,?,?,?,?)";
	let post = [package_number, quiz_number, email, score, quiz_answer, correct];

	conn.query(sql, post, (err, results, fields) => {
		if (err) {
			console.log(err);
			return res.status(400).json({
			error: "db error"
			});
		} else {
			return res.status(200).json({
				num : results.insertId
			});
		}
	});
});

//패키지 평균 점수
router.post("/packageAVG", (req, res) => {
	const packagenum = req.body.packagenum;

	console.log(packagenum);
	let sql = 	"SELECT ROUND((SELECT SUM(score) FROM result WHERE package_number = ? AND correct = 'true')"
				+ "/(SELECT COUNT(distinct email) FROM result WHERE package_number = ?), 1) as AVG";
	let post = [packagenum, packagenum];
	conn.query(sql, post, (err, results, fields) => {
		if (err) {
			console.log(err);
			return res.status(400).json({
			error: "db error"
			});
		} else {
			console.log(results[0]);
			return res.status(200).json({
				avg : results
			});
		}
	});
});

//퀴즈 평균 확률
router.post("/quizAVG", (req, res) => {
	const quiznum = req.body.quiznum;

	let sql = 	"SELECT ROUND(((SELECT COUNT(*) FROM result WHERE quiz_number = ? AND correct = 'true')"
				+ "/(SELECT COUNT(*) FROM result WHERE quiz_number = ?))*100, 1) as AVG";
	let post = [quiznum, quiznum];
	conn.query(sql, post, (err, results, fields) => {
		if (err) {
			console.log(err);
			return res.status(400).json({
				error: "db error"
			});
		} else {
			return res.status(200).json({
				avg : results
			});
		}
	});
});

//퀴즈 참여 인원
router.post("/quizExistSum", (req, res) => {
	const quiznum = req.body.quiznum;

	let sql = "SELECT COUNT(*) as count from result where quiz_number = ?";
	let post = [quiznum];
	conn.query(sql, post, (err, results, fields) => {
		if (err) {
			console.log(err);
			return res.status(400).json({
				error: "db error"
			});
		} else {
			return res.status(200).json({
				sum : results
			});
		}
	});
});

//패키지 푼 적 있나 확인
router.post("/packageConfirm", (req, res) => {
	const id = req.body.id;
	const packagenum = req.body.packagenum;

	let sql = 	"SELECT * from result where email=? AND package_number=?";
	let post = [id, packagenum];
	conn.query(sql, post, (err, results, fields) => {
		if (err) {
			console.log(err);
			return res.status(400).json({
				error: "db error"
			});
		} else {
			if(results.length === 0){
				return res.status(200).json({
					confirm : true
				});
			}else{
				let sum = 0;
				for(var i=0; i<results.length; i++){
					console.log(results[i]);
					if(results[i].correct=='true'){
						sum += results[i].score;
					}
				}
				return res.status(200).json({
					confirm : false,
					scoreSum: sum
				});
			}
		}
	});
});

//퀴즈 푼 적 있나 확인
router.post("/singleQuizConfirm", (req, res) => {
	const id = req.body.id;
	const quiznum = req.body.quiznum;

	let sql = 	"SELECT * from result where email=? AND quiz_number=? AND package_number=0";
	let post = [id, quiznum];
	conn.query(sql, post, (err, results, fields) => {
		if (err) {
			console.log(err);
			return res.status(400).json({
				error: "db error"
			});
		} else {
			if(results.length === 0){
				return res.status(200).json({
					confirm : true
				});
			}else{
				return res.status(200).json({
					confirm : false
				});
			}
		}
	});
});

//퀴즈 맞았는지 확인
router.post("/quizConfirm", (req, res) => {
	const id = req.body.id;
	const packagenum = req.body.packagenum;
	const quiznum = req.body.quiznum;

	let sql = 	"SELECT correct from result where email=? AND package_number=? AND quiz_number=?";
	let post = [id, packagenum, quiznum];
	conn.query(sql, post, (err, results, fields) => {
		if (err) {
			console.log(err);
			return res.status(400).json({
				error: "db error"
			});
		} else {
			return res.status(200).json({
				confirm : results
			});
		}
	});
});

/*
	router.post("/packageDelete", (req, res) => {
		console.log(req.body.num);
		const pname = req.body.num;

		let sql = "DELETE FROM package WHERE num=?";
		let post = [pname];
		conn.query(sql, post, (err, results, fields) => {
			if (err) {
				console.log(err);
				return res.status(400).json({
				error: "db error"
				});
			} else {
					return res.status(200).json({
					success: true,
					error: null,
				});
			}
		});
	});

	router.post("/packageCopy", (req, res) => {
		console.log(req.body.num);
		const pname = req.body.num;

		let sql = "INSERT INTO package (title, content, quizlist, id, count, total_score, final_score) " 
		+ "SELECT CONCAT(title,'(2)'), content, quizlist, id, 0, 0, 0 FROM package where num = ?";
		let post = [pname];
		conn.query(sql, post, (err, results, fields) => {
			if (err) {
				console.log(err);
				return res.status(400).json({
				error: "db error"
				});
			} else {
					return res.status(200).json({
						num : results.insertId
				});
			}
		});
	});

	router.get("/packageClick", (req, res) => {
		const package_num = req.query.num;
		let sql = "SELECT * FROM package WHERE num=?";
		
    let post = [package_num];

    conn.query(sql, post, (err, results) => {
      if (err) { 
				throw err
			}
      else {
				return res.status(200).json({
					package: results
				})
			}  
    });
	})
	
	router.post("/finalUpdate", (req, res) => {

		const packagenum = req.body.packagenum1;

		let sql = "UPDATE package SET final_score = 0 WHERE num = ?";
				let post = [packagenum];
				conn.query(sql, post, (err, results, fields) => {
				if (err) {
					console.log(err);
					return res.status(400).json({
					error: "db error"
				 });
				} else {
					return res.status(200).json({
					success: true,
					error: null
					});
				}
				});
		});

	router.post("/packageUpdate", (req, res) => {
		const packagenum = req.body.packagenum;
		const quizlist = req.body.quizlist;
		const final_score = req.body.score;
		const title = req.body.title;
		const content = req.body.content;
		console.log(final_score);

		let sql = "UPDATE package SET title = ?, content = ?, quizlist = ?, final_score = final_score + ? WHERE num = ?";
				let post = [title, content, quizlist, final_score, packagenum];
				conn.query(sql, post, (err, results, fields) => {
				if (err) {
					console.log(err);
					return res.status(400).json({
					error: "db error"
				 });
				} else {
					return res.status(200).json({
					success: true,
					error: null
					});
				}
				});
		});

	router.post("/quizInsert", (req, res) => {
		const quizname = req.body.title;
		const optionlist = req.body.option;
		const tag = req.body.val;
		const answer = req.body.answer;
		const score = req.body.score;
		const bool = req.body.bool;
		const id = req.body.username;

		if(bool==false){
			return res.status(200).json({
				num: null
			 });
		}

		let sql = "INSERT INTO quiz (quizname, optionlist, tag, answer, score, id) VALUES(?,?,?,?,?,?)";
				let post = [quizname, optionlist, tag, answer, score, id];
				conn.query(sql, post, (err, results, fields) => {
				if (err) {
					console.log(err);
					return res.status(400).json({
					error: "db error"
				 });
				} else {
					console.log(results.insertId);
					return res.status(200).json({
						num : results.insertId
					});
				}
				});
		});

		router.post("/quizInsert2", (req, res) => {
			const quizname = req.body.title;
			const optionlist = req.body.option;
			const tag = req.body.val;
			const answer = req.body.answer;
			const score = req.body.score;
			const dbnum = req.body.dbnum;
			const id = req.body.id;
	
			console.log(quizname);
			console.log(optionlist);
			console.log(tag);
			console.log(answer);
			console.log(score);
			console.log(dbnum);

			let sqlTest = "SELECT * FROM quiz WHERE num = ?";
			let postTEST = [dbnum];
			conn.query(sqlTest, postTEST, (err, results) => {
				if (results.length === 0) {
					let sql = "INSERT INTO quiz (quizname, optionlist, tag, answer, score, id) VALUES(?,?,?,?,?,?)";
					let post = [quizname, optionlist, tag, answer, score, id];
					conn.query(sql, post, (err, results, fields) => {
						if (err) {
							console.log(err);
							return res.status(400).json({
								error: "db error"
							});
						} else {
							return res.status(200).json({
								num : results.insertId
							});
						}
					});
				}else{
					let sql = "UPDATE quiz SET quizname = ?, optionlist = ?, tag = ?, answer = ?, score = ? WHERE num = ?";
					let post = [quizname, optionlist, tag, answer, score, dbnum];
					conn.query(sql, post, (err, results, fields) => {
						if (err) {
							console.log(err);
							return res.status(400).json({
								error: "db error"
							});
						} else {
							return res.status(200).json({
								num : results.insertId
							});
						}
					});
				}
			})

			
			});

	router.get('/quiz', (req, res) =>{
		conn.query("SELECT * FROM quiz ORDER BY num DESC", (err, results) => {
			if(err) {
				return res.send(err);
			}else {
				return res.json({
					results
				})
			}
		});
	});

	router.post("/selectQuiz", (req, res) => {
		const quizKey = req.body.dbnum;
		let sql = "SELECT * FROM quiz WHERE num = ?";
		let post = [quizKey];
		console.log(quizKey);
		conn.query(sql, post, (err, results, fields) => {
			if (err) { 
				throw err
			} else {
				return res.status(200).json({
					quiz : results
				});
			}
			});
		});

		router.post('/quiztest', (req, res) =>{
			const quizKey = req.body.quizNum;

			let sql = "SELECT * FROM quiz WHERE num = ?";
			let post = [quizKey];
			conn.query(sql, post, (err, results) => {
				if(err) {
					return res.send(err);
				}else {
					return res.json({
						quiz: results
					})
				}
			});
		});

		router.post("/quizDelete", (req, res) => {
			console.log(req.body.num);
			const num = req.body.num;
	
			let sql = "DELETE FROM quiz WHERE num=?";
			let post = [num];
			conn.query(sql, post, (err, results, fields) => {
				if (err) {
					console.log(err);
					return res.status(400).json({
					error: "db error"
					});
				} else {
						return res.status(200).json({
						success: true,
						error: null,
					});
				}
			});
		});

		router.post("/countUpdate", (req, res) => {
			const package_number = req.body.pknum;
			let sql = "UPDATE package SET count = count + 1 WHERE num = ?";
			let post = [package_number];
					conn.query(sql, post, () => {
						return 0
					});
			});

		router.post("/resultInsert", (req, res) => {
			const package_number = req.body.pknum;
			const quiz_number = req.body.dbnum;
			const email = req.body.email;
			const quiz_answer = req.body.answer;
			const correct = req.body.correct;
			const total_score = req.body.total_score;

			let sql = "INSERT INTO result (package_number, quiz_number, email, quiz_answer, correct) VALUES(?,?,?,?,?)"+
			"ON DUPLICATE KEY UPDATE quiz_answer = VALUES(quiz_answer), correct = VALUES(correct)";
			let post = [package_number, quiz_number, email, quiz_answer, correct];

			let sql2 = "UPDATE package SET total_score = total_score + ? WHERE num = ?";
			let post2 = [total_score, package_number];

					conn.query(sql, post, (err, results, fields) => {
					if (err) {
						console.log(err);
						return res.status(400).json({
						error: "db error"
					 });
					} else {
						console.log(results.insertId);
						conn.query(sql2, post2);
						return res.status(200).json({
							num : results.insertId
						});
					}
					});
			});


			router.post("/singleresultInsert", (req, res) => {
				const quiz_number = req.body.dbnum;
				const email = req.body.email;
				const quiz_answer = req.body.answer;
				const correct = req.body.correct;
	
				let sql = "INSERT INTO result (quiz_number, email, quiz_answer, correct) VALUES(?,?,?,?)";
				let post = [quiz_number, email, quiz_answer, correct];
	
				conn.query(sql, post, (err, results, fields) => {
					if (err) {
						console.log(err);
						return res.status(400).json({
						error: "db error"
					 });
					} else {
						console.log(results.insertId);
						return res.status(200).json({
							num : results.insertId
						});
					}
					});
			});

			router.post("/existResult", (req, res) => {
				const num = req.body.num;
				const email = req.body.id;
				let sql = "SELECT * FROM result WHERE package_number = ? AND email = ?";
				let post = [num,email];
				conn.query(sql, post, (err, results, fields) => {
					if (err) { 
						throw err
					} else {
						return res.status(200).json({
							result : results
						});
					}
					});
				});

				router.post("/exist", (req, res) => {
					const email = req.body.id;
					const bool = req.body.bool;
					console.log(bool);
					let sql = '';
					if(bool){
						sql = "SELECT package.* FROM package JOIN result ON (package.num = result.package_number AND result.email = ?)";
					}else{
						sql = "SELECT * FROM package WHERE NOT EXISTS "+
						"(SELECT * FROM result WHERE package.num = result.package_number AND result.email = ?)";
					}
					
					let post = [email];
					conn.query(sql, post, (err, results, fields) => {
						if (err) { 
							throw err
						} else {
							return res.status(200).json({
								result : results
							});
						}
						});
					});

			router.post("/selectResultNumber", (req, res) => {
				const packagenum = req.body.packagenum;
				const id = req.body.id;
				const quiznum = req.body.quizNum;
				let sql = "SELECT * FROM result WHERE package_number = ? and email = ? and quiz_number = ?";
				let post = [packagenum, id, quiznum];
				conn.query(sql, post, (err, results, fields) => {
					if (err) { 
						throw err
					} else {
						return res.status(200).json({
							result : results
						});
					}
					});
				});

				router.post("/selectTag", (req, res) => {
					const tag = req.body.tag;
					let sql = "SELECT * FROM quiz WHERE tag REGEXP ? ORDER BY num DESC";
					let post = [tag];
					conn.query(sql, post, (err, results, fields) => {
						if (err) { 
							throw err
						} else {
							console.log(results);
							return res.status(200).json({
								results
							});
						}
						});
					});

					*/
export default router;
