const Team = require('../../models/valorantTeam');
const CSTeams = require('../../models/csgoMembers');

module.exports.prioritySetter = (rank) => {
    let priority = -1;
    if(rank === "Radiant"){
        priority = 1;
    } else if (rank === "Immortal 3"){
        priority = 2;
    } else if(rank === "Immortal 2"){
        priority = 3;
    } else if(rank === "Immortal 1"){
        priority = 4;
    } else if(rank === "Diamond 3"){
        priority = 5;
    } else if(rank === "Diamond 2"){
        priority = 6;
    } else if(rank === "Diamond 1"){
        priority = 7;
    } else if(rank === "PLatinum 3"){
        priority = 8;
    } else if(rank === "Platinum 2"){
        priority = 9;
    } else if(rank === "Platinum 1"){
        priority = 10;
    } else if(rank === "Gold 3"){
        priority = 11;
    } else if(rank === "Gold 2"){
        priority = 12;
    } else if(rank === "Gold 1"){
        priority = 13;
    } else if(rank === "Silver 3"){
        priority = 14;
    } else if(rank === "Silver 2"){
        priority = 15;
    } else if(rank === "Silver 1"){
        priority = 16;
    } else if(rank === "Bronze 3"){
        priority = 17;
    } else if(rank === "Bronze 2"){
        priority = 18;
    } else if(rank === "Bronze 1"){
        priority = 19;
    } else if(rank === "Iron 3"){
        priority = 20;
    } else if(rank === "Iron 2"){
        priority = 21;
    } else if(rank === "Iron 1"){
        priority = 22;
    } else if(rank === "Unranked"){
        priority = 23;
    }

    return priority;
}

module.exports.rankSorter = async (bestRank) => {
    let arr = [];
    for(let i=0; i<bestRank.length; i++){
        for(let j=i+1; j<bestRank.length; j++){
            if(bestRank[i].priority > bestRank[j].priority){
                let temp = bestRank[i];
                bestRank[i] = bestRank[j];
                bestRank[j] = temp;
            }
        }
    }

    for(let i=0; i<bestRank.length; i++){
        const member = await Team.findById(bestRank[i].id);
        arr.push(member);
    }

    return arr;
}

module.exports.csgorankSorter = async (bestRank) => {
    let arr = [];
    for(let i=0; i<bestRank.length; i++){
        for(let j=i+1; j<bestRank.length; j++){
            if(bestRank[i].priority > bestRank[j].priority){
                let temp = bestRank[i];
                bestRank[i] = bestRank[j];
                bestRank[j] = temp;
            }
        }
    }

    for(let i=0; i<bestRank.length; i++){
        const member = await CSTeams.findById(bestRank[i].id);
        arr.push(member);
    }

    return arr;
}

module.exports.csgoPrioritySetter = (rank) => {
    let priority = -1;
    if(rank === "Global Elite" || rank === "GE"){
        priority = 1;
    } else if (rank === "Supreme Master First Class" || rank === "SMFC"){
        priority = 2;
    } else if(rank === "Legendary Eagle Master" || rank === "LEM"){
        priority = 3;
    } else if(rank === "Legendary Eagle" || rank === "LE"){
        priority = 4;
    } else if(rank === "Distinguished Master Guardian" || rank === "DMG"){
        priority = 5;
    } else if(rank === "Master Guardian Elite" || rank === "MGE"){
        priority = 6;
    } else if(rank === "Master Guardian 2" || rank === "MG2"){
        priority = 7;
    } else if(rank === "Master Guardian 1" || rank === "MG1"){
        priority = 8;
    } else if(rank === "Gold Nova Master" || rank === "GNM"){
        priority = 9;
    } else if(rank === "Gold Nova 3" || rank === "GN3"){
        priority = 10;
    } else if(rank === "Gold Nova 2" || rank === "GN2"){
        priority = 11;
    } else if(rank === "Gold Nova 1" || rank === "GN1"){
        priority = 12;
    } else if(rank === "Silver Elite Master" || rank === "SEM"){
        priority = 13;
    } else if(rank === "Silver Elite" || rank === "SE"){
        priority = 14;
    } else if(rank === "Silver 4" || rank === "S4"){
        priority = 15;
    } else if(rank === "Silver 3" || rank === "S3"){
        priority = 16;
    } else if(rank === "Silver 2" || rank === "S2"){
        priority = 17;
    } else if(rank === "Silver 1" || rank === "S1"){
        priority = 18;
    } 

    return priority;
}